export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-800 text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
        Welcome to the Quiz App
      </h1>
      <p className="text-lg md:text-xl mb-4 animate-fade-in delay-200">
        Test your knowledge. See your results instantly.
      </p>
      <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform animate-fade-in delay-500">
        Start Quiz
      </button>
    </main>
  );
}
