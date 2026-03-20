import { useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function Result() {
  const { result, generateResult } = useApp();

  useEffect(() => {
    generateResult();
  }, []);

  if (!result) return <p>Generating...</p>;

  return (
    <div>
      <h2>Result</h2>
      <p>Score: {result.scores.interview}</p>
      <p>{result.feedback}</p>
    </div>
  );
}