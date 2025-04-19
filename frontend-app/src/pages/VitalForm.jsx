import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiPlus,
  FiActivity,
  FiThermometer,
  FiHeart,
  FiUpload,
  FiBarChart2,
  FiDroplet,
  FiUser
} from "react-icons/fi";
import { MdLocalPharmacy } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseURL from "../assets/API_URL";

const VitalForm = () => {
  const [form, setForm] = useState({
    Name: "",
    Age: "",
    Gender: "",
    Vitals: {
      Hemoglobin: "",
      RBC_Count: "",
      Platelet_Count: "",
      ESR: "",
      HbA1c: ""
    }
  });
  const navigate = useNavigate();

  const handleAnalyzer = () => navigate("/recommendation");
  const handleFileUpload = () => navigate("/fileupload");
  const PrescriptionManager = () => navigate("/prescription");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name in form.Vitals) {
      setForm({
        ...form,
        Vitals: {
          ...form.Vitals,
          [name]: value
        }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}/api/vital`, form)
      .then((res) => {
        toast.success("Patient data added successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
        setForm({
          Name: "",
          Age: "",
          Gender: "",
          Vitals: {
            Hemoglobin: "",
            RBC_Count: "",
            Platelet_Count: "",
            ESR: "",
            HbA1c: ""
          }
        });
      })
      .catch((error) => {
        console.error("Error adding patient data:", error);
        toast.error("Failed to add patient data");
      });
  };

  const getInputClass = (value, normalMin, normalMax) => {
    const numValue = parseFloat(value);
    if (!value) return "border-gray-300";
    if (numValue < normalMin || numValue > normalMax) {
      return "border-red-300 bg-red-50";
    }
    return "border-green-300 bg-green-50";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-indigo-600">Patient</span> Health Data Entry
            </h1>
            <p className="mt-1 text-gray-600 text-sm">
              Record patient information and blood test results
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={handleAnalyzer}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm"
            >
              <FiBarChart2 className="mr-2" />
              Analyzer
            </button>
           
        {/*    <button
              onClick={PrescriptionManager}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm"
            >
              <MdLocalPharmacy className="mr-2" />
              Prescription Manager
            </button>*/}
            <button
              onClick={handleFileUpload}
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md transition-colors shadow-sm"
            >
              <FiUpload className="mr-2" />
              Upload Data
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              New Patient Health Record
            </h2>
            <p className="text-sm text-gray-600">
              Please fill all fields with patient information and test results
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FiUser className="mr-2 text-indigo-600" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="Name"
                      value={form.Name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="Age"
                      value={form.Age}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="Gender"
                      value={form.Gender}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Blood Test Results */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FiDroplet className="mr-2 text-red-600" />
                  Blood Test Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hemoglobin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hemoglobin (g/dL)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="Hemoglobin"
                        value={form.Vitals.Hemoglobin}
                        onChange={handleChange}
                        step="0.1"
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${getInputClass(
                          form.Vitals.Hemoglobin,
                          12,
                          16
                        )}`}
                      />
                      {form.Vitals.Hemoglobin && (
                        <span className="absolute right-3 top-3 text-xs font-medium">
                          {form.Vitals.Hemoglobin < 12 || form.Vitals.Hemoglobin > 16
                            ? "⚠ Abnormal"
                            : "✓ Normal"}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Normal range: 12-16 g/dL
                    </p>
                  </div>

                  {/* RBC Count */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RBC Count (million/cu.mm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="RBC_Count"
                        value={form.Vitals.RBC_Count}
                        onChange={handleChange}
                        step="0.1"
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${getInputClass(
                          form.Vitals.RBC_Count,
                          4.5,
                          5.5
                        )}`}
                      />
                      {form.Vitals.RBC_Count && (
                        <span className="absolute right-3 top-3 text-xs font-medium">
                          {form.Vitals.RBC_Count < 4.5 || form.Vitals.RBC_Count > 5.5
                            ? "⚠ Abnormal"
                            : "✓ Normal"}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Normal range: 4.5-5.5 million/cu.mm
                    </p>
                  </div>

                  {/* Platelet Count */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platelet Count (µL)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="Platelet_Count"
                        value={form.Vitals.Platelet_Count}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${getInputClass(
                          form.Vitals.Platelet_Count,
                          150000,
                          450000
                        )}`}
                      />
                      {form.Vitals.Platelet_Count && (
                        <span className="absolute right-3 top-3 text-xs font-medium">
                          {form.Vitals.Platelet_Count < 150000 || form.Vitals.Platelet_Count > 450000
                            ? "⚠ Abnormal"
                            : "✓ Normal"}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Normal range: 150,000-450,000/µL
                    </p>
                  </div>

                  {/* ESR */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ESR (mm/hr)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="ESR"
                        value={form.Vitals.ESR}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${getInputClass(
                          form.Vitals.ESR,
                          0,
                          20
                        )}`}
                      />
                      {form.Vitals.ESR && (
                        <span className="absolute right-3 top-3 text-xs font-medium">
                          {form.Vitals.ESR > 20
                            ? "⚠ Abnormal"
                            : "✓ Normal"}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Normal range: 0-20 mm/hr
                    </p>
                  </div>

                  {/* HbA1c */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      HbA1c (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="HbA1c"
                        value={form.Vitals.HbA1c}
                        onChange={handleChange}
                        step="0.1"
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${getInputClass(
                          form.Vitals.HbA1c,
                          4,
                          5.6
                        )}`}
                      />
                      {form.Vitals.HbA1c && (
                        <span className="absolute right-3 top-3 text-xs font-medium">
                          {form.Vitals.HbA1c > 5.6
                            ? "⚠ Abnormal"
                            : "✓ Normal"}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Normal range: 4-5.6%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors"
              >
                Submit Patient Data
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default VitalForm;