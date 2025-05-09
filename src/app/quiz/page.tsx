"use client";
import { useState } from "react";
import { basicQuiz } from "../quizzes/basicQuiz";
const questions = basicQuiz.questions;

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleNext = () => {
    if (selected === q.answer) setScore((s) => s + 1);
    if (current < questions.length - 1) {
      setCurrent((i) => i + 1);
      setSelected(null);
    } else setFinished(true);
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-gray-800 p-6 animate-fade-in">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900/70 backdrop-blur-md shadow-2xl p-8">
        {finished ? (
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-extrabold text-white">Quiz Complete!</h2>
            <p className="text-xl text-emerald-400">
              You scored {score} / {questions.length}
            </p>
            <button
              onClick={restart}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <>
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

            <div className="mt-10 text-right">
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
