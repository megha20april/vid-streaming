import { useEffect, useState } from "react";

export default function useVid(key) {
  const [vidData, setVidData] = useState(null);

  console.log("I'm in useVid", vidData);

  if (!key) console.log("No Key");

  useEffect(() => {
    fetch(`http://localhost:4000/video/${key}/data`)
      .then((res) => res.json())
      .then((res) => {
        console.log("RES", res);
        setVidData(res);
      })
      .catch((err) => console.error(err));
    console.log("I'm in useVid's useEffect");
  }, [key]);
  return vidData;
}
