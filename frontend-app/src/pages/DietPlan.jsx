import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiRefreshCw,
  FiPrinter,
  FiDownload,
  FiArrowLeft,
  FiPlus,
  FiTrendingUp,
  FiUser,
  FiChevronDown
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseURL from "../assets/API_URL";

const dietTypes = ["Normal", "Vegetarian", "Vegan", "Gluten-Free", "Diabetic-Friendly"];

const DietPlan = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [dietType, setDietType] = useState("Normal");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchDietPlan();
    }
  }, [dietType, userId]);

  const fetchDietPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/dietplan/${dietType.toLowerCase()}/${userId}`
      );
      setPlan(formatResponse(response.data.recommendation));
      toast.success("Diet plan loaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error fetching diet plan:", err);
      toast.error("Failed to fetch diet plan", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setLoading(false);
  };

  const formatResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-gray-800'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
      .replace(/### (.*?)\n/g, "<h3 class='text-lg font-semibold mt-6 mb-3 text-indigo-600'>$1</h3>")
      .replace(/#### (.*?)\n/g, "<h4 class='text-md font-medium mt-4 mb-2 text-gray-700'>$1</h4>")
      .replace(/(?:- (.*?)(?:\n|$))+/g, (match) => {
        const items = match
          .split("\n")
          .map((item) => item.replace(/^- /, "").trim())
          .filter(Boolean);
        return `<ul class='list-disc ml-5 space-y-1 mt-2'>${items
          .map((item) => `<li class='text-gray-600'>${item}</li>`)
          .join("")}</ul>`;
      })
      .replace(/\n/g, "<br>")
      .replace(/[#*]/g, "");
  };

  const downloadPlan = () => {
    if (!plan) return;
    const textContent = plan.replace(/<[^>]*>?/gm, "");
    const element = document.createElement("a");
    const file = new Blob([textContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${dietType.toLowerCase()}_diet_plan.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.info("Diet plan downloaded", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const printPlan = () => {
    // Create a print-specific stylesheet
    const printStyles = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-content, .print-content * {
          visibility: visible;
        }
        .print-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          margin: 0;
          padding: 20px;
        }
      }
    `;
  
    // Create elements for printing
    const styleElement = document.createElement('style');
    styleElement.innerHTML = printStyles;
    
    const printDiv = document.createElement('div');
    printDiv.className = 'print-content';
    printDiv.innerHTML = `
      <div class="p-6 max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold text-center mb-6">${dietType} Diet Plan</h2>
        <div class="text-gray-700">${plan}</div>
        <div class="mt-8 text-sm text-gray-500 text-center">
          Generated for patient ID: ${userId} • ${new Date().toLocaleDateString()}
        </div>
      </div>
    `;
  
    // Add elements to document
    document.body.appendChild(styleElement);
    document.body.appendChild(printDiv);
  
    // Print and clean up
    window.print();
    
    // Delay removal to ensure printing completes
    setTimeout(() => {
      document.body.removeChild(styleElement);
      document.body.removeChild(printDiv);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-indigo-600">Personalized</span> Diet Plan
            </h1>
            <p className="mt-1 text-gray-600 text-sm">
              Nutrition recommendations tailored for patient ID: {userId}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors shadow-sm"
            >
              <FiArrowLeft className="mr-2" />
              Back
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Controls Section */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              Diet Plan Configuration
            </h2>
            <p className="text-sm text-gray-600">
              Select diet type and generate personalized recommendations
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
              {/* Custom Dropdown */}
              <div className="w-full sm:w-1/3 relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex justify-between items-center p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>{dietType}</span>
                  <FiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200 max-h-60 overflow-auto">
                    {dietTypes.map((type) => (
                      <button
                        key={type}
                        className={`w-full text-left px-4 py-2 hover:bg-indigo-50 ${dietType === type ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'}`}
                        onClick={() => {
                          setDietType(type);
                          setDropdownOpen(false);
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={fetchDietPlan}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors whitespace-nowrap flex items-center justify-center disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiRefreshCw className="mr-2" />
                    Generate Plan
                  </>
                )}
              </button>
            </div>

            {/* Plan Display */}
            {plan && (
              <div>
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: plan }}
                    aria-live="polite"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end mt-6 gap-3">
                  <button
                    onClick={downloadPlan}
                    className="flex items-center justify-center px-6 py-2.5 bg-white border border-green-600 text-green-600 hover:bg-green-50 rounded-md transition-colors shadow-sm hover:shadow-md"
                  >
                    <FiDownload className="mr-2" />
                    <span>Download as TXT</span>
                  </button>
                  <button
                    onClick={printPlan}
                    className="flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm hover:shadow-md"
                  >
                    <FiPrinter className="mr-2" />
                    <span>Print Plan</span>
                  </button>
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

export default DietPlan;