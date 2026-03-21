import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const aptitudeQuestionBank = [
  "Solve: 17 * 3.",
  "Which number comes next: 2, 4, 8, 16, ?",
  "If all A are B and all B are C, are all A C?",
  "Rearrange: 'dog the chased cat the.'",
  "Choose the correct grammar: 'She has/have to go.'",
  "What is the synonym of 'abundant'?",
  "Find the odd one out: apple, banana, carrot, grape.",
  "Solve: 45 / 5 + 6.",
  "If x=10, y=2, evaluate x^2 - y^2.",
  "Direction: If north is left, where is east?",
  "Antonym of 'transparent'.",
  "Analogy: Cat is to kitten as dog is to ___.",
  "Correct sentence: 'I have went' or 'I have gone'?",
  "Meaning of 'perplexed'.",
  "True/False: If today is not Monday then not Tuesday.",
  "Verb in 'She quickly ran home'.",
  "Which day before Wednesday?",
  "Calculate: 9 * 6 - 12.",
  "Change to passive: 'He can do it.'",
  "Main idea: 'Sun rises in the east.'",
  "Handshake problem with 5 people.",
  "Correct form: 'They is/are going'.",
  "Logic: If A→B and ¬B then ¬A.",
  "Meaning of 'meticulous'.",
  "Correct sentence: 'He don't like apples'.",
];

const defaultTechnicalQuestions = [
  { _id: "tech1", question: "Explain Big O notation." },
  { _id: "tech2", question: "What is normalization in DBMS?" },
  { _id: "tech3", question: "Describe the TCP handshake." },
  { _id: "tech4", question: "What is process vs thread in OS?" },
  { _id: "tech5", question: "Write a SQL query for users older than 30." },
  { _id: "tech6", question: "What is ACID property in DBMS?" },
  { _id: "tech7", question: "Explain deadlock and avoidance." },
  { _id: "tech8", question: "Python reverse string function." },
];

const aiOneOnOneDefaults = [
  { _id: "ai1", question: "Describe a difficult problem you solved." },
  { _id: "ai2", question: "How do you learn new technologies?" },
  { _id: "ai3", question: "How would you handle scope changes?" },
];

export default function Interview() {
  const { interviewConfig, questions, submitAnswer, generateResult } = useApp();
  const navigate = useNavigate();

  const [phase, setPhase] = useState("aptitude");
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [phaseQuestions, setPhaseQuestions] = useState([]);
  const [phaseDone, setPhaseDone] = useState(false);
  const [sandboxCode, setSandboxCode] = useState("# Start coding...");
  const [sandboxLang, setSandboxLang] = useState("python");
  const [sandboxOutput, setSandboxOutput] = useState("");
  const [scores, setScores] = useState({ aptitude: 0, technical: 0, ai: 0 });

  const preparedAptitude = useMemo(() => aptitudeQuestionBank.map((q, i) => ({ _id: `apt-${i + 1}`, question: q })), []);

  useEffect(() => {
    if (!interviewConfig.company || !interviewConfig.jd) {
      navigate("/");
      return;
    }

    if (phase === "aptitude") {
      setPhaseQuestions(preparedAptitude);
      setQIndex(0);
      setPhaseDone(false);
    }
  }, [interviewConfig, phase, preparedAptitude, navigate]);

  useEffect(() => {
    if (phase === "technical") {
      const companyKey = interviewConfig.company.toLowerCase();
      const includeCore = companyKey.includes("core") || companyKey.includes("tech") || companyKey.includes("engineer");

      const coding = questions.length > 0 ? questions.slice(0, 4) : defaultTechnicalQuestions.slice(0, 4);
      const core = includeCore ? questions.slice(4, 7).length ? questions.slice(4, 7) : defaultTechnicalQuestions.slice(1, 4) : [];
      const sql = [{ _id: "sql1", question: "Write a join query to find orders with customer names." }];

      setPhaseQuestions([...coding, ...core, ...sql]);
      setQIndex(0);
      setPhaseDone(false);
    }

    if (phase === "oneonone") {
      const oneOnOne = questions.length > 0 ? questions.slice(-3) : aiOneOnOneDefaults;
      setPhaseQuestions(oneOnOne);
      setQIndex(0);
      setPhaseDone(false);
    }
  }, [phase, interviewConfig.company, questions]);

  const currentQuestion = phaseQuestions[qIndex];
  const isLast = qIndex >= phaseQuestions.length - 1;

  const handleAnswerSubmit = async () => {
    if (!currentQuestion || !answer.trim()) return;

    await submitAnswer({ questionId: currentQuestion._id, question: currentQuestion.question, answer: answer.trim() });
    setScores((prev) => ({ ...prev, [phase]: prev[phase] + 1 }));
    setAnswer("");

    if (!isLast) {
      setQIndex((prev) => prev + 1);
      return;
    }

    setPhaseDone(true);
  };

  const handleContinue = () => {
    if (phase === "aptitude") {
      setPhase("technical");
      return;
    }
    if (phase === "technical") {
      setPhase("oneonone");
      return;
    }
    if (phase === "oneonone") {
      generateResult().then(() => navigate("/result"));
      return;
    }
  };

  const runSandbox = () => {
    setSandboxOutput(`Sandbox ran ${sandboxLang}: output simulated.`);
  };

  if (phase === "technical" && phaseQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading technical questions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-2">{phase === "aptitude" ? "Aptitude Round" : phase === "technical" ? "Technical Assessment" : "AI One-on-One"}</h2>
        <p className="text-sm text-gray-500 mb-4">Company: {interviewConfig.company} • Mode: {interviewConfig.mode}</p>

        {!phaseDone ? (
          <>
            <div className="mb-4 text-sm text-gray-700">Question {qIndex + 1} / {phaseQuestions.length}</div>
            <div className="mb-3 text-lg font-semibold">{currentQuestion?.question || "No question"}</div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={handleAnswerSubmit} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
              {isLast ? "Complete Phase" : "Next Question"}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h3 className="font-semibold">Stage complete</h3>
              <p>{phase} score: {scores[phase]} / {phaseQuestions.length}</p>
            </div>

            {phase === "technical" && (
              <div className="p-4 border border-gray-200 rounded-lg bg-slate-50">
                <h3 className="font-semibold mb-2">Code sandbox</h3>
                <div className="flex gap-2 mb-2">
                  <select value={sandboxLang} onChange={(e) => setSandboxLang(e.target.value)} className="border border-gray-300 rounded-lg p-2">
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="c#">C#</option>
                  </select>
                  <button onClick={runSandbox} className="bg-blue-600 text-white px-3 py-2 rounded-lg">Run</button>
                </div>
                <textarea value={sandboxCode} onChange={(e) => setSandboxCode(e.target.value)} rows={6} className="w-full border border-gray-300 rounded-lg p-2 mb-2" />
                <div className="bg-white p-2 border border-gray-300 rounded-lg">
                  <strong>Sandbox output:</strong>
                  <pre className="text-sm whitespace-pre-wrap mt-1">{sandboxOutput}</pre>
                </div>
              </div>
            )}

            <button onClick={handleContinue} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              {phase === "oneonone" ? "Finish Interview" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
