import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
      <h1 className="text-5xl font-bold text-blue-700">
        AI CivicAssist
      </h1>

      <p className="mt-4 text-lg">
        Government Scheme & Document Agent
      </p>

      <Link to="/citizen-form">
        <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg">
          Get Started
        </button>
      </Link>
    </div>
  );
}

export default Home;