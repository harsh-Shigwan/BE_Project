import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiTrendingUp, FiUser } from "react-icons/fi";
import { FaRobot } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseURL from "../assets/API_URL";

const Vital = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseURL}/api/vital`);
        setPatients(response.data.reverse());
      } catch (error) {
        toast.error("Failed to fetch patient data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddData = () => navigate("/vitalForm");
  const handleBlockchain = () => navigate("/blockchain_store");
  const handleChatbot = () => navigate("/medi_chatbot");

  const getStatusColor = (status) => {
    const statusColors = {
      high: "bg-red-50 text-red-600 border-red-100",
      low: "bg-blue-50 text-blue-600 border-blue-100",
      critical: "bg-purple-50 text-purple-600 border-purple-100",
      default: "bg-green-50 text-green-600 border-green-100"
    };
    return statusColors[status] || statusColors.default;
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      high: "▲",
      low: "▼",
      critical: "⚠",
      default: "✓"
    };
    return statusIcons[status] || statusIcons.default;
  };

  const getReferenceRange = (testName, gender) => {
    const ranges = {
      Hemoglobin: { male: "13.5-17.5 g/dL", female: "12.0-15.5 g/dL" },
      "RBC Count": "4.5-5.9 million/cu.mm",
      "Platelet Count": "150-450 ×10³/µL",
      ESR: "<20 mm/hr",
      HbA1c: "<5.7% (normal), 5.7-6.4% (prediabetic), ≥6.5% (diabetic)",
      "WBC Count": "4.0-11.0 ×10³/µL",
      "Blood Glucose": "70-99 mg/dL (fasting)"
    };
    
    return testName === "Hemoglobin" 
      ? ranges[testName][gender.toLowerCase() === "male" ? "male" : "female"]
      : ranges[testName] || "N/A";
  };

  const getVitalsEntries = (vitals) => {
    return vitals ? Object.entries(vitals) : [];
  };

  const getTestStatus = (test, value, gender) => {
    switch(test) {
      case "Hemoglobin":
        return gender === "Male" 
          ? (value < 13.5 ? "low" : value > 17.5 ? "high" : "normal")
          : (value < 12.0 ? "low" : value > 15.5 ? "high" : "normal");
      case "RBC_Count":
        return value < 4.5 ? "low" : value > 5.9 ? "high" : "normal";
      case "Platelet_Count":
        return value < 150 ? "low" : value > 450 ? "high" : "normal";
      case "ESR":
        return value > 20 ? "high" : "normal";
      case "HbA1c":
        return value < 5.7 ? "normal" : value < 6.5 ? "prediabetic" : "high";
      default:
        return "normal";
    }
  };

  const getTestUnit = (test) => {
    const units = {
      Hemoglobin: "g/dL",
      RBC_Count: "million/cu.mm",
      Platelet_Count: "×10³/µL",
      ESR: "mm/hr",
      HbA1c: "%"
    };
    return units[test] || "";
  };

  const renderClinicalNotes = (patient) => {
    const vitals = patient.Vitals || {};
    const gender = patient.Gender;
    const notes = [];

    if (vitals.Hemoglobin > (gender === "Male" ? 17.5 : 15.5)) {
      notes.push("Hemoglobin at upper range (consider hydration status, possible polycythemia or dehydration)");
    } else if (vitals.Hemoglobin < (gender === "Male" ? 13.5 : 12.0)) {
      notes.push("Low hemoglobin suggests anemia (evaluate for iron deficiency, chronic disease, or blood loss)");
    }

    if (vitals.RBC_Count > 5.9) {
      notes.push("Elevated RBC count may indicate polycythemia or dehydration");
    } else if (vitals.RBC_Count < 4.5) {
      notes.push("Low RBC count may suggest anemia or bone marrow suppression");
    }

    if (vitals.Platelet_Count > 450) {
      notes.push("Thrombocytosis (high platelets) may indicate inflammation or myeloproliferative disorder");
    } else if (vitals.Platelet_Count < 150) {
      notes.push("Thrombocytopenia (low platelets) increases bleeding risk (evaluate for immune causes or marrow suppression)");
    }

    if (vitals.ESR > 20) {
      notes.push("Elevated ESR suggests systemic inflammation (consider infection, autoimmune disease, or malignancy)");
    }

    if (vitals.HbA1c >= 6.5) {
      notes.push("Elevated HbA1c suggests diabetes (≥6.5%) - recommend confirmatory testing and diabetes management");
    } else if (vitals.HbA1c >= 5.7) {
      notes.push("HbA1c in prediabetic range (5.7-6.4%) - recommend lifestyle modifications and monitoring");
    }

    notes.push("Correlate with clinical presentation and consider repeating abnormal values");
    notes.push("Review medication history that may affect these parameters");

    return notes.map((note, index) => <p key={index}>• {note}</p>);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-indigo-600">Medalyzer</span> Health analysis Dashboard
            </h1>
            <p className="mt-1 text-gray-600 text-sm">
              Comprehensive patient laboratory results with clinical analysis
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={handleAddData}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm"
            >
              <FiPlus className="mr-2" />
              New Patient
            </button>
            <button
              onClick={handleChatbot}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm"
            >
              <FaRobot className="mr-2" />
              Medi ChatBot 
            </button>
            <button
              onClick={handleBlockchain}
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md transition-colors shadow-sm"
            >
              <FiTrendingUp className="mr-2" />
              Blockchain Records
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patient records...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">No patient records found</p>
            <button
              onClick={handleAddData}
              className="mt-4 flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors mx-auto shadow-sm"
            >
              <FiPlus className="mr-2" />
              Add First Patient
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {patients.map((patient) => (
              <div key={patient._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-2 rounded-full w-14 h-14 flex items-center justify-center">
                        <FiUser className="text-indigo-600 text-xl" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-800">{patient.Name || 'N/A'}</h2>
                        <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                          <span>Age: {patient.Age || 'N/A'}</span>
                          <span>Gender: {patient.Gender || 'N/A'}</span>
                          <span>Last Updated: {patient.timestamp ? new Date(patient.timestamp).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Patient ID: {patient._id?.slice(-6) || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
                  {getVitalsEntries(patient.Vitals).map(([test, value]) => {
                    const status = getTestStatus(test, value, patient.Gender);
                    const unit = getTestUnit(test);
                    const displayTest = test.replace("_", " ");

                    return (
                      <div key={test} className="p-2 border-b border-r border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-500">{displayTest}</p>
                            <p className="text-2xl font-semibold mt-1">
                              {value} <span className="text-lg text-gray-500">{unit}</span>
                            </p>
                          </div>
                          <span className={`text-xs px-1 py-1 rounded-full ${getStatusColor(status)} border`}>
                            {status.toUpperCase()} {getStatusIcon(status)}
                          </span>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          <p>Reference: {getReferenceRange(displayTest, patient.Gender)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Clinical Summary</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {renderClinicalNotes(patient)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Vital;