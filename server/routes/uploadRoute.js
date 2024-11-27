import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
} from "@aws-sdk/client-sqs";
import { SQSclient, ECSclient, s3Client } from "../config/awsConfig.js";
import { DescribeTasksCommand, RunTaskCommand } from "@aws-sdk/client-ecs";
import { DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

// SQSClient is the instance of the AWS SQS client we created
// receiveCommand is a command that requests messages from the queue.

export default async function poll() {
  const cmd = new ReceiveMessageCommand({
    QueueUrl:
      "https://sqs.us-east-1.amazonaws.com/730335489290/temp-raw-video-created",
    MaxNumberOfMessages: 1, // only get 1 message at a time
    WaitTimeSeconds: 20, // wait 20 seconds for a message
  });

  while (true) {
    const { Messages } = await SQSclient.send(cmd); // this tells the client to send the command to SQS
    // Messages is an array of recieved messages

    if (!Messages) {
      console.log("No messages in Queue");
      continue;
    }

    try {
      for (const message of Messages) {
        // here message is an object
        const { MessageId, Body } = message;

        console.log("Message Recieved", { MessageId, Body });

        // Validate & parse the event

        // Parse the Body to get the event object
        let event;
        try {
          // Attempt to parse the Body as JSON
          event = JSON.parse(Body);
        } catch (parseError) {
          console.error("Failed to parse message body as JSON:", parseError);
          continue; // Skip this message and continue polling
        }

        // Validate the event structure
        if (!event || !event.Records || !Array.isArray(event.Records)) {
          console.log("Invalid event structure.");
          continue;
        }

        const delMsgcmd = new DeleteMessageCommand({
          QueueUrl:
            "https://sqs.us-east-1.amazonaws.com/730335489290/temp-raw-video-created",
          ReceiptHandle: message.ReceiptHandle,
        });

        // Further validation for specific event types
        if (event.Event === "s3:TestEvent") {
          await SQSclient.send(delMsgcmd);
          continue;
        }

        for (const record of event.Records) {
          const { s3 } = record;
          const {
            bucket,
            object: { key },
          } = s3;

          // Check if the file is a video, based on its extension
          if (!key.endsWith(".mp4")) {
            console.log("Ignoring non-video file:", key);
            continue; // Skip processing this event
          }

          // Get metadata that contains transcoded video key

          const metacmd = new HeadObjectCommand({
            Bucket: bucket.name,
            Key: key,
          });

          const response = await s3Client.send(metacmd);
          console.log("MetaData", response);

          // Spin Docker container using ECR (Elastic Container Registry) and ECS (Elastic Container Service)

          const runTaskCmd = new RunTaskCommand({
            taskDefinition:
              "arn:aws:ecs:us-east-1:730335489290:task-definition/video-transcoder",
            cluster: "arn:aws:ecs:us-east-1:730335489290:cluster/Dev",
            launchType: "FARGATE",
            networkConfiguration: {
              awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                securityGroups: ["sg-0b190309e5a7e3379"],
                subnets: [
                  "subnet-07965fa09754f19ac",
                  "subnet-0d2fbbba474fd91db",
                ],
              },
            },
            overrides: {
              containerOverrides: [
                {
                  name: "video-transcoder",
                  environment: [
                    { name: "BUCKET_NAME", value: bucket.name },
                    { name: "KEY", value: key },
                    {
                      name: "BASE_DIR",
                      value: response.Metadata["transcoded-basedir"],
                    },
                  ],
                },
              ],
            },
          });

          // ECR is used to STORE the container images from local machine
          // ECS is used to then pull those images from ECR and run them as a container

          // Run the ECS task
          const runTaskResponse = await ECSclient.send(runTaskCmd);

          // Ensure ECS task completes before proceeding
          const taskArn = runTaskResponse.tasks[0].taskArn;

          // Wait for the task to finish
          const describeTaskCmd = new DescribeTasksCommand({
            cluster: process.env.AWS_CLUSTER,
            tasks: [taskArn],
          });

          let taskStatus;
          do {
            // Wait for a short period before polling again
            await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 seconds wait

            const describeTaskResponse = await ECSclient.send(describeTaskCmd);
            taskStatus = describeTaskResponse.tasks[0].lastStatus;
          } while (taskStatus !== "STOPPED");

          console.log("ECS task completed.");
          // Delete the message from the queue
          await SQSclient.send(delMsgcmd);

          // Delete the object from S3
          const deleteObjCmd = new DeleteObjectCommand({
            Bucket: bucket.name,
            Key: key,
          });

          await s3Client.send(deleteObjCmd);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

// poll();
