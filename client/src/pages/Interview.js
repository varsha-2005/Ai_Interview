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

  if (!questions.length) return <p>Loading...</p>;

  return (
    <div>
      <h2>Interview</h2>
      <p>{questions[currentIndex]?.question}</p>

      <input value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <button onClick={handleNext}>Next</button>
    </div>
  );
}