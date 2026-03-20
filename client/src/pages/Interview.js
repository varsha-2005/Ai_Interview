import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Interview() {
  const { questions, currentIndex, submitAnswer } = useApp();
  const navigate = useNavigate();

  const [answer, setAnswer] = useState("");

  const handleNext = async () => {
    await submitAnswer(answer);
    setAnswer("");

    if (currentIndex >= questions.length - 1) {
      navigate("/result");
    }
  };

  if (!questions.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading questions...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-7">
        <h2 className="text-2xl font-bold mb-4">Interview Question</h2>
        <p className="text-gray-800 text-lg mb-6">{questions[currentIndex]?.question}</p>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer"
        />
        <button
          className="w-full bg-indigo-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-indigo-700 transition"
          onClick={handleNext}
        >
          {currentIndex >= questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}