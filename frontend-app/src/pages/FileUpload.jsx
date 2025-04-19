import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiUpload, FiUser, FiCalendar, FiActivity, FiAlertCircle, FiSave } from 'react-icons/fi';
import baseURL from '../assets/API_URL';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        if (selectedFile.size > 10 * 1024 * 1024) {
          toast.error('File size exceeds 10MB limit');
        } else {
          setFile(selectedFile);
          setFileName(selectedFile.name);
        }
      } else {
        toast.error('Please upload a PDF file only');
      }
    }
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a PDF file first');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${baseURL}/api/pdf/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setExtractedData(response.data.data);
        console.log(response.data.data);
        toast.success('Data extracted successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to extract data');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error processing PDF';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!extractedData) {
      toast.error('No data to submit. Please extract data first.');
      return;
    }
  
    setIsSubmitting(true);
    
    try {
      const requestData = {
        Name: extractedData.Name || "",
        Age: extractedData.Age || "",
        Gender: extractedData.Gender || "",
        Vitals: {
          Hemoglobin: extractedData.Vitals?.Hemoglobin || "",
          RBC_Count: extractedData.Vitals?.RBCCount || "",
          Platelet_Count: extractedData.Vitals?.PlateletCount || "",
          ESR: extractedData.Vitals?.ESR || "",
          HbA1c: extractedData.Vitals?.HbA1c || ""
        }
      };

      const response = await axios.post(`${baseURL}/api/vital`, requestData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success('Patient data submitted successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to submit data');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Error submitting data';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Medical Report Analyzer
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Upload your medical report PDF to extract vital health information
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <form onSubmit={handleExtract}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Medical Report (PDF)
                  </label>
                  <div className="mt-1 flex items-center">
                    <label className="flex flex-col items-center justify-center w-full py-8 px-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-150 ease-in-out">
                      <div className="flex flex-col items-center justify-center">
                        <FiUpload className="w-10 h-10 text-indigo-500 mb-2" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF files only (max. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {fileName && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected file: <span className="font-medium">{fileName}</span>
                    </p>
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-md text-white font-medium ${
                      isLoading ? 'bg-indigo-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    } transition duration-150 ease-in-out flex items-center`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Extract Data'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!extractedData || isSubmitting}
                    className={`px-6 py-3 rounded-md text-white font-medium ${
                      !extractedData || isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } transition duration-150 ease-in-out flex items-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Submit Data
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {extractedData && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FiActivity className="mr-2 text-indigo-500" />
                Extracted Medical Data
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 rounded-lg p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                    <FiUser className="mr-2" />
                    Patient Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-indigo-100 pb-2">
                      <span className="text-gray-600">Name</span>
                      <span className="font-medium text-gray-800">
                        {extractedData.Name || 'Not available'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-indigo-100 pb-2">
                      <span className="text-gray-600">Age</span>
                      <span className="font-medium text-gray-800">
                        {extractedData.Age || 'Not available'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-indigo-100 pb-2">
                      <span className="text-gray-600">Gender</span>
                      <span className="font-medium text-gray-800">
                        {extractedData.Gender || 'Not available'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                    <FiActivity className="mr-2" />
                    Vital Signs
                  </h3>
                  <div className="space-y-3">
                    {extractedData.Vitals ? (
                      Object.entries(extractedData.Vitals).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between border-b border-indigo-100 pb-2"
                        >
                          <span className="text-gray-600">{key}</span>
                          <span className="font-medium text-gray-800">{value}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No vital data extracted</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Health Assessment
                </h3>
                {extractedData.Vitals?.HbA1c ? (
                  parseFloat(extractedData.Vitals.HbA1c) > 6.5 ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Warning: Elevated HbA1c Level
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>
                              An HbA1c level of {extractedData.Vitals.HbA1c} indicates
                              poor glucose control. Please consult with your healthcare
                              provider.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">
                            Normal HbA1c Level
                          </h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>
                              Your HbA1c level of {extractedData.Vitals.HbA1c} is within
                              the normal range. Keep up the good work!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="text-gray-500">No HbA1c data available for assessment</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default FileUpload;