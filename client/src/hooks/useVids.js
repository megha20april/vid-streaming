import { useEffect, useState } from "react";

export default function useVids() {
  const [vids, setVids] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/videos")
      .then((res) => res.json())
      .then((res) => {
        setVids(res);
      })
      .catch((err) => console.error(err));
  }, []);

  return vids;
}
