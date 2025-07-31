import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to NewsX</h1>
        <p className="text-lg mb-6">
          A modern, interactive platform that blends social media with real-time news. 
        </p>
        <p className="text-md text-gray-600 mb-8">
          Get tweet-like updates, follow trending news topics, and be part of a social news experience.
          Whether you’re looking to stay informed or share your voice — NewsX has you covered.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full transition duration-200"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export{
    WelcomePage
}
