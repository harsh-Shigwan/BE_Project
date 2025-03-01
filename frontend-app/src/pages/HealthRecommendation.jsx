// import { useState } from "react";
// import axios from "axios";

// const HealthRecommendation = () => {
//   const [userId, setUserId] = useState("");
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchRecommendation = async () => {
//     if (!userId) return alert("Please enter a User ID");
//     setLoading(true);

//     try {
//       const response = await axios.get(`http://localhost:5000/api/recommendation/${userId}`);
//       setData(response.data.recommendation);
//       console.log("Recommendation:", response.data.recommendation);
//     } catch (error) {
//       console.error("Error fetching recommendation:", error);
//       alert("Failed to get recommendation. Try again.");
//       console.log(error.response?.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
//         <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">
//           Health & Fitness Recommendation
//         </h1>
//         <input
//           type="text"
//           className="w-full p-2 border rounded mb-4"
//           placeholder="Enter User ID"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//         />
//         <button
//           onClick={fetchRecommendation}
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
//           disabled={loading}
//         >
//           {loading ? "Loading..." : "Get Recommendation"}
//         </button>

//         {data && (
//           <div className="mt-6 p-4 bg-gray-50 rounded shadow">
//             <h2 className="text-xl font-semibold text-gray-700 mb-2">Recommendation:</h2>
//             <pre className="text-sm text-gray-600 whitespace-pre-wrap">{data}</pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HealthRecommendation;


import { useState } from "react";
import axios from "axios";
import { FaUtensils, FaDumbbell, FaHeartbeat, FaWalking } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HealthRecommendation = () => {
  const [userId, setUserId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
  const handle = () => {
    navigate(`/dietPlan/${userId}`);
  }
  const handle1 = () => {
    navigate(`/exercise/${userId}`);
  };
  const fetchRecommendation = async () => {
    if (!userId) return alert("Please enter a User ID");
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:5000/api/recommendation/${userId}`);
      setData(response.data.recommendation);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      alert("Failed to get recommendation. Try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log("User ID:", userId);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">
          Health & Fitness Recommendation
        </h1>

        {/* Input Box */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button
            onClick={fetchRecommendation}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get"}
          </button>
        </div>

        {/* Data Display */}
        {data && (
          <div className="mt-6 space-y-6">
            {/* Diet Plan */}
            <div className="p-4 bg-gray-50 rounded shadow" onClick={handle}>
            
              <h2 className="text-xl font-semibold flex items-center gap-2 text-green-600">
                <FaUtensils /> Diet Plan
              </h2>
              <ul className="text-gray-600 mt-2 space-y-1">
                <li><b>Breakfast:</b> Oatmeal with berries, nuts, and low-fat milk</li>
                <li><b>Lunch:</b> Grilled chicken salad with whole-wheat croutons</li>
                <li><b>Dinner:</b> Grilled fish with brown rice and veggies</li>
              </ul>
            </div>

            {/* Exercise Plan */}
            <div className="p-4 bg-gray-50 rounded shadow" onClick={handle1}>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-600">
                <FaDumbbell /> Exercise Plan
              </h2>
              <ul className="text-gray-600 mt-2 space-y-1">
                <li><b>Cardio:</b> Brisk walking (30 min, 3-5x/week)</li>
                <li><b>Strength:</b> Bodyweight exercises (2-3x/week)</li>
                <li><b>Flexibility:</b> Yoga or stretching (2-3x/week)</li>
              </ul>
            </div>

            {/* Health Tips */}
            <div className="p-4 bg-gray-50 rounded shadow">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-red-600">
                <FaHeartbeat /> Health Tips
              </h2>
              <ul className="text-gray-600 mt-2 space-y-1">
                <li>✅ <b>Stay Hydrated:</b> Drink plenty of water</li>
                <li>✅ <b>Manage Stress:</b> Meditation & Yoga</li>
                <li>✅ <b>Sleep Well:</b> 7-9 hours per night</li>
                <li>✅ <b>Limit Processed Foods:</b> Choose fresh, whole foods</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthRecommendation;
