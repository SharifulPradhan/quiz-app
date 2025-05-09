"use client";
import { useState, useEffect, useRef } from "react";
import { basicQuiz } from "../quizzes/basicQuiz";
import successAnimation from '../../../public/successAnimation.json';

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

const questions = basicQuiz.questions;

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30);
  const [totalTimeLeft, setTotalTimeLeft] = useState(questions.length * 30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const q = questions[current];

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset question timer
    setQuestionTimeLeft(30);

    // Start new timer
    timerRef.current = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          // Time expired - move to next question
          handleAutoNext();
          return 0;
        }
        return prev - 1;
      });

      setTotalTimeLeft(prev => {
        if (prev <= 1) {
          // Total time expired - finish quiz
          if (timerRef.current) clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current]); // Only re-run when current question changes

  const handleAutoNext = () => {
    console.log(current)
    // Check answer for current question
    if (selected === q.answer) {
      setScore(s => s + 1);
    }
    
    // Move to next question or finish
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const handleNext = () => {
    // Check answer for current question
    if (selected === q.answer) {
      setScore(s => s + 1);
    }
    
    // Move to next question or finish
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setQuestionTimeLeft(30);
    setTotalTimeLeft(questions.length * 30);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-gray-800 p-6 animate-fade-in">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900/70 backdrop-blur-md shadow-2xl p-8">
        {finished ? (
          <div className="text-center space-y-6">
            {score >= questions.length * 0.9 ? (
              <>
                <Lottie animationData={successAnimation} loop={false} className="h-64 mx-auto" />
                <h2 className="text-4xl font-extrabold text-emerald-400">Excellent Work!</h2>
              </>
            ) : (
              <h2 className="text-4xl font-extrabold text-white">Quiz Complete!</h2>
            )}
            <p className="text-xl text-emerald-400">
              You scored {score} / {questions.length}
            </p>
            {score < questions.length * 0.9 && (
              <p className="text-lg text-yellow-400">
                You can do better! Try your best next time.
              </p>
            )}
            <button
              onClick={restart}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="text-white font-medium">
                Question {current + 1}/{questions.length}
              </div>
              <div className="flex gap-4">
                <div className="bg-slate-800/50 text-white px-3 py-1 rounded-lg">
                  Question: {formatTime(questionTimeLeft)}
                </div>
                <div className="bg-slate-800/50 text-white px-3 py-1 rounded-lg">
                  Total: {formatTime(totalTimeLeft)}
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              {q.question}
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {q.options.map(({ text, icon }) => {
                const isSel = selected === text;
                return (
                  <button
                    key={text}
                    onClick={() => setSelected(text)}
                    className={`group rounded-2xl overflow-hidden shadow-lg transform transition-all duration-200 focus:outline-none focus:ring-4 ${
                      isSel
                        ? "ring-4 ring-indigo-400 scale-105"
                        : "hover:-translate-y-1 hover:shadow-2xl"
                    }`}
                  >
                    <div className="relative h-40 w-full flex justify-center items-center text-5xl">
                      {icon}
                    </div>
                    <div
                      className={`w-full py-3 text-center font-semibold ${
                        isSel
                          ? "bg-indigo-500 text-white"
                          : "bg-slate-800/90 text-slate-200 group-hover:bg-slate-700/90"
                      }`}
                    >
                      {text}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex justify-between items-center">
              <div className="w-1/4 h-2 bg-slate-700 rounded-full">
                <div
                  className="h-2 bg-indigo-500 rounded-full"
                  style={{ width: `${(questionTimeLeft / 30) * 100}%` }}
                ></div>
              </div>
              <button
                onClick={handleNext}
                disabled={!selected}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                  selected
                    ? "bg-white text-black hover:scale-105"
                    : "bg-gray-500/50 text-gray-300 cursor-not-allowed"
                }`}
              >
                {current < questions.length - 1 ? "Next" : "Finish"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}