import { createContext, useContext, useState } from "react";
import axios from "../api/axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interviewId, setInterviewId] = useState(null);
  const [result, setResult] = useState(null);

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
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
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

  // 🎯 START INTERVIEW
  const startInterview = async (company, jd, difficulty) => {
    const jobRes = await axios.post("/job", {
      company,
      description: jd,
    });

    const interviewRes = await axios.post("/interview/start", {
      jobId: jobRes.data._id,
      difficulty,
    });

    setInterviewId(interviewRes.data._id);

    const qRes = await axios.get(
      `/interview/questions?company=${company}&difficulty=${difficulty}&type=technical`
    );

    setQuestions(qRes.data);
    setCurrentIndex(0);
  };

  // 💬 SUBMIT ANSWER
  const submitAnswer = async (answer) => {
    const currentQuestion = questions[currentIndex];

    await axios.post("/answers", {
      interviewId,
      questionId: currentQuestion._id,
      answer,
    });

    setCurrentIndex((prev) => prev + 1);
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
        currentIndex,
        result,

        login,
        register,
        logout,
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