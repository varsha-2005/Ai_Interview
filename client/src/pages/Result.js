import { useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function Result() {
  const { result, generateResult } = useApp();

  useEffect(() => {
    generateResult();
  }, [generateResult]);

  if (!result)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Generating result...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Your Interview Result</h2>
        <div className="space-y-3 text-gray-700">
          <p className="text-xl">
            Score: <span className="font-semibold text-indigo-600">{result.scores.interview}</span>
          </p>
          <p>{result.feedback}</p>
        </div>
      </div>
    </div>
  );
}