import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPrint, FaDownload, FaArrowLeft } from "react-icons/fa";
import baseURL from "../assets/API_URL";
const exerciseTypes = ["cardio", "strength", "flexibility", "high-intensity", "yoga"];
const durations = ["20min", "40min", "1hr"];

const ExercisePlan = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState("cardio");
  const [selectedDuration, setSelectedDuration] = useState("20min");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const planRef = useRef(null);

  const fetchExercisePlan = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/exercise/${selectedExercise}/${selectedDuration}/${userId}`);
      setPlan(response.data.recommendation);
    } catch (error) {
      console.error("Error fetching exercise plan:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExercisePlan();
  }, [selectedExercise, selectedDuration]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([plan], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "exercise_plan.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <button
        className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Back
      </button>
      <h2 className="text-2xl font-bold mb-4">Personalized Exercise Plan</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Select Exercise Type:</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {exerciseTypes.map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg border ${selectedExercise === type ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setSelectedExercise(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Select Duration:</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {durations.map((duration) => (
            <button
              key={duration}
              className={`px-4 py-2 rounded-lg border ${selectedDuration === duration ? "bg-green-500 text-white" : "bg-gray-200"}`}
              onClick={() => setSelectedDuration(duration)}
            >
              {duration}
            </button>
          ))}
        </div>
      </div>
      <button
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold mt-4 hover:bg-indigo-700"
        onClick={fetchExercisePlan}
      >
        Generate Plan
      </button>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg" ref={planRef}>
        {loading ? <p>Loading...</p> : <p>{plan || "Select options to generate a plan."}</p>}
      </div>
      {plan && (
        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600"
            onClick={handlePrint}
          >
            <FaPrint /> Print
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
            onClick={handleDownload}
          >
            <FaDownload /> Download
          </button>
        </div>
      )}
    </div>
  );
};

export default ExercisePlan;
