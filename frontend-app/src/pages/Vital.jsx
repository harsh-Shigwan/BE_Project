
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import baseURL from '../assets/API_URL';
const Vital = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handle = () => {
    navigate('/vitalForm');
  }
  useEffect(() => {
    axios.get(`${baseURL}/api/vital`) // ✅ Added `http://`
      .then((res) => setData(res.data))
      .catch((error) => console.log(error.response?.data)
     //console.log(error.response?.data));
  )
      ;
  }, []);

  const analyzeHealth = (data) => {
    const benchmarks = {
      heartRate: { normal: [60, 100], critical: [40, 140] },
      bloodPressure: { normal: '90/60-120/80', critical: '140/90+' },
      temperature: { normal: [36.1, 37.2], critical: [35, 39] },
      oxygenLevel: { normal: [95, 100], critical: [90, 95] },
    };

    const results = data.map((item) => {
      const status = {};
      Object.keys(benchmarks).forEach((key) => {
        const value = item[key];
        const [min, max] = benchmarks[key].normal;
        if (value < min || value > max) {
          status[key] = 'Critical';
        } else if (value === min || value === max) {
          status[key] = 'Borderline';
        } else {
          status[key] = 'Normal';
        }
      });
      return { ...item, status };
    });

    return results;
  };

  const analyzedData = analyzeHealth(data);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 w-60">Vital Data</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600  mb-10 " onClick={handle}>
        Add Data
      </button>
      <ul>
        {analyzedData.map((item) => (
            <li key={item._id} className="mb-2 p-2 border rounded bg-gray-100">
            <p>💓 Heart Rate: {item.heartRate} ({item.status.heartRate})</p>
            <p>🩸 Blood Pressure: {item.bloodPressure} ({item.status.bloodPressure})</p>
            <p>🌡 Temperature: {item.temperature}°C ({item.status.temperature})</p>
            <p>🫁 Oxygen Level: {item.oxygenLevel}% ({item.status.oxygenLevel})</p>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default Vital;
