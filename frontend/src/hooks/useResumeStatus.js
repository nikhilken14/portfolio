import { useEffect, useState } from "react";
import { getResumeStatus, hasApi } from "../api/client";

/** True only when the API confirms a resume exists. Also wakes the API early. */
export default function useResumeStatus() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (!hasApi) return;
    let alive = true;
    getResumeStatus()
      .then((d) => alive && setAvailable(Boolean(d?.available)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return available;
}
