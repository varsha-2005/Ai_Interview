import { createContext, useContext, useState } from "react";
import axios from "../api/axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { token } : null;
  });
  const [questions, setQuestions] = useState([]);
  const [interviewId, setInterviewId] = useState(null);
  const [result, setResult] = useState(null);
  const [interviewConfig, setInterviewConfig] = useState({
    company: "",
    jd: "",
    difficulty: "easy",
    mode: "Full interview",
    resumeId: null,
  });

  // 🔐 AUTH
  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        password,
      });
      // Do not auto-authenticate post-register; let user login explicitly.
      return res.data;
    } catch (error) {
      console.error("Register failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/resume", formData);
    return res.data;
  };

  const screenResume = async (resumeId, jobDescription, company) => {
    const res = await axios.post("/resume/screen", {
      resumeId,
      jobDescription,
      company,
    });
    return res.data;
  };

  const getLangGraphFlow = async () => {
    const res = await axios.get("/langgraph/flow");
    return res.data;
  };

  // 🎯 START INTERVIEW
  const startInterview = async (company, jd, difficulty, mode, resumeId) => {
    setInterviewConfig({ company, jd, difficulty, mode, resumeId });

    const jobRes = await axios.post("/job", {
      company,
      description: jd,
    });

    const interviewRes = await axios.post("/interview/start", {
      jobId: jobRes.data._id,
      company,
      difficulty,
      mode,
      resumeId,
    });

    setInterviewId(interviewRes.data._id);

    let loadedQuestions = [];
    if (mode !== "Only Aptitude") {
      const questionResolvers = [];
      if (mode === "Full interview" || mode === "Only Technical") {
        questionResolvers.push(
          axios.get(
            `/interview/questions?company=${company}&difficulty=${difficulty}&mode=${encodeURIComponent("Technical")}&resumeText=${encodeURIComponent(jd)}&role=${encodeURIComponent("Software Engineer")}`
          )
        );
      }
      if (mode === "Full interview" || mode === "Only AI One-on-One") {
        questionResolvers.push(
          axios.get(
            `/interview/questions?company=${company}&difficulty=${difficulty}&mode=${encodeURIComponent("AI One-on-One")}&resumeText=${encodeURIComponent(jd)}&role=${encodeURIComponent("Software Engineer")}`
          )
        );
      }

      const results = await Promise.all(questionResolvers);
      loadedQuestions = results.flatMap((r) => r.data || []);
    }

    setQuestions(loadedQuestions);
  };

  // 💬 SUBMIT ANSWER
  const submitAnswer = async ({ questionId, question, answer }) => {
    await axios.post("/answers", {
      interviewId,
      questionId,
      question,
      answer,
    });
  };

  // 📊 GENERATE RESULT
  const generateResult = async () => {
    const res = await axios.post("/result/generate", {
      interviewId,
    });

    setResult(res.data);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        questions,
        interviewId,
        result,
        interviewConfig,

        login,
        register,
        logout,
        uploadResume,
        screenResume,
        getLangGraphFlow,
        startInterview,
        submitAnswer,
        generateResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);