import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { uploadResume, screenResume, startInterview, getLangGraphFlow } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("Software Engineer");
  const [jd, setJD] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [mode, setMode] = useState("Full interview");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [screening, setScreening] = useState(false);
  const [ragResult, setRagResult] = useState(null);
  const [flow, setFlow] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async () => {
    if (!resumeFile) {
      setUploadError("Please choose a PDF file before upload.");
      return;
    }
    setUploadError("");

    try {
      const resume = await uploadResume(resumeFile);
      console.log("Resume uploaded successfully:", resume);
      setResumeId(resume.id || resume._id);  // Use 'id' field (or fallback to '_id')
      setStep(2);
    } catch (err) {
      setUploadError(err?.response?.data?.message || err.message || "Upload failed");
      console.error("UploadResume failed", err);
    }
  };

  const handleScreen = async () => {
    if (!resumeId || !jd || !company) {
      setUploadError("Please fill company and JD to screen your resume.");
      return;
    }
    setScreening(true);
    const result = await screenResume(resumeId, jd, company);
    setRagResult(result);
    setScreening(false);
  };

  const handleStart = async () => {
    if (!resumeId || !company || !jd) {
      alert("Finish step 1 and 2: upload resume + company + JD");
      return;
    }

    await startInterview(company, jd, difficulty, mode, resumeId);
    const graph = await getLangGraphFlow();
    setFlow(graph);
    setStep(3);
    navigate("/interview");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">AI Interview Setup</h2>

        <div className="mb-6 flex gap-3 text-sm font-medium">
          <div className={`px-3 py-2 rounded ${step >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}>1. Upload Resume</div>
          <div className={`px-3 py-2 rounded ${step >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}>2. Job + JD</div>
          <div className={`px-3 py-2 rounded ${step >= 3 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}>3. Mode + Start</div>
        </div>

        <div className="space-y-5">
          <div className="border border-gray-200 rounded-lg p-4 bg-slate-50">
            <h3 className="font-semibold mb-2">Step 1: Upload your resume (PDF)</h3>
            <div className="flex gap-2 items-center">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="border border-gray-300 rounded-lg p-2 flex-1"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
            {resumeId && <p className="mt-2 text-sm text-green-600">Resume uploaded successfully (ID: {resumeId})</p>}
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-slate-50">
            <h3 className="font-semibold mb-2">Step 2: Company details + Job description</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <input
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mt-3"
              placeholder="Job description"
              value={jd}
              onChange={(e) => setJD(e.target.value)}
              rows={4}
            />
            <button
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={() => setStep(3)}
              disabled={!company || !jd}
            >
              Continue to mode selection
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-slate-50">
            <h3 className="font-semibold mb-2">Step 3: Interview mode and start</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <select
                className="w-full border border-gray-300 rounded-lg p-3"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                className="w-full border border-gray-300 rounded-lg p-3"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option>Full interview</option>
                <option>Only Aptitude</option>
                <option>Only Technical</option>
                <option>Only AI One-on-One</option>
              </select>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                onClick={handleStart}
              >
                Start Interview
              </button>
            </div>

            <button
              className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              onClick={handleScreen}
              disabled={!resumeId || !company || !jd || screening}
            >
              {screening ? "Screening..." : "Run RAG Screening"}
            </button>
          </div>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{uploadError}</div>
          )}

          {ragResult && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-semibold">RAG Score: {ragResult.score}</p>
              <pre className="text-sm whitespace-pre-wrap">{ragResult.feedback}</pre>
            </div>
          )}

          {flow && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="font-semibold">Interview flow (service)</p>
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(flow, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}