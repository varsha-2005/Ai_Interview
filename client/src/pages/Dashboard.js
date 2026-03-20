import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { startInterview } = useApp();
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [jd, setJD] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  const handleStart = async () => {
    await startInterview(company, jd, difficulty);
    navigate("/interview");
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <input placeholder="Company" onChange={(e) => setCompany(e.target.value)} />
      <textarea onChange={(e) => setJD(e.target.value)} />
      <select onChange={(e) => setDifficulty(e.target.value)}>
        <option>easy</option>
        <option>medium</option>
        <option>hard</option>
      </select>

      <button onClick={handleStart}>Start</button>
    </div>
  );
}