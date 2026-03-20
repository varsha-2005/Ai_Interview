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
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Interview Setup</h2>
        <div className="grid gap-4">
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Job description"
            value={jd}
            onChange={(e) => setJD(e.target.value)}
            rows={5}
          />
          <select
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
          <button
            className="w-full bg-indigo-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-indigo-700 transition"
            onClick={handleStart}
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}