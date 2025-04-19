import { useState } from "react";
import axios from "axios";
import { 
  FiActivity,
  FiHeart,
  FiDroplet,
  FiPlus,
  FiTrendingUp,
  FiUser,
  FiCoffee,
  FiAward,
  FiSun
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseURL from "../assets/API_URL";

const HealthRecommendation = () => {
  const [userId, setUserId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDietPlan = () => navigate(`/dietPlan/${userId}`);
  const handleExercisePlan = () => navigate(`/exercise/${userId}`);

  const fetchRecommendation = async () => {
    if (!userId) {
      toast.warning("Please enter a User ID", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/recommendation/${userId}`);
      setData(response.data.recommendation);
      toast.success("Recommendation loaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      console.log("Error response data:", error.response?.data);
      toast.error("Failed to get recommendation. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-indigo-600">Health & Fitness</span> Recommendations
            </h1>
            <p className="mt-1 text-gray-600 text-sm">
              Personalized wellness plans based on your health profile
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm"
            >
              <FiActivity className="mr-2" />
              View Vitals
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Input Section */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              Get Recommendations
            </h2>
            <p className="text-sm text-gray-600">
              Enter patient ID to generate personalized health recommendations
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Patient ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <button
                onClick={fetchRecommendation}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors whitespace-nowrap"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : "Get Recommendations"}
              </button>
            </div>

            {/* Recommendations Display */}
            {data && (
              <div className="mt-8 space-y-6">
                {/* Diet Plan Card */}
                <div 
                  className="p-5 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={handleDietPlan}
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <FiCoffee className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Diet Plan</h3>
                  </div>
                  <ul className="text-gray-600 space-y-2 pl-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span><b className="text-gray-700">Eat more natural foods:</b> Choose fruits, vegetables, whole grainFruits, veggies, whole grains.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span><b className="text-gray-700">Stay hydrated:</b> Drink 7-8 glasses of water every day.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span><b className="text-gray-700">Avoid junk food:</b> Less sugar, less oily food..</span>
                    </li>
                  </ul>
                  <div className="mt-3 text-sm text-indigo-600 flex items-center">
                    View full diet plan <FiPlus className="ml-1" />
                  </div>
                </div>

                {/* Exercise Plan Card */}
                <div 
                  className="p-5 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={handleExercisePlan}
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FiAward className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Exercise Plan</h3>
                  </div>
                  <ul className="text-gray-600 space-y-2 pl-2">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><b className="text-gray-700">Start with basics:</b> Do 20–30 mins of walking, jogging, or stretching daily.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><b className="text-gray-700">Be consistent:</b>Exercise at the same time every day.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><b className="text-gray-700">Mix it up:</b> Try different exercises like yoga, cardio, or light strength training</span>
                    </li>
                  </ul>
                  <div className="mt-3 text-sm text-indigo-600 flex items-center">
                    View full exercise plan <FiPlus className="ml-1" />
                  </div>
                </div>

                {/* Health Tips Card */}
                <div className="p-5 border border-gray-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <FiHeart className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Health Tips</h3>
                  </div>
                  <ul className="text-gray-600 space-y-2 pl-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><b className="text-gray-700">Limit screen:</b>Rest your eyes often.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><b className="text-gray-700">Manage Stress:</b> Meditation & Yoga</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><b className="text-gray-700">Sleep Well:</b> 7-9 hours per night</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><b className="text-gray-700">Limit Processed Foods:</b> Choose fresh, whole foods</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default HealthRecommendation;