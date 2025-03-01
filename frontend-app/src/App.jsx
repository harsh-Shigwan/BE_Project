import React from 'react'
//import VitalsDashboard from './pages/VitalsDashboard'
//import VitalData from '../../backend/models/vitalData'
//import Data from './pages/Data.jsx'
import Vital from './pages/Vital.jsx'
import VitalForm from './pages/VitalForm.jsx'
import HealthRecommendation from './pages/HealthRecommendation.jsx'
import FileUpload from './pages/FileUpload.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DietPlan from './pages/DietPlan.jsx'
import ExercisePlan from './pages/ExercisePlan.jsx'
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Vital />}></Route>
      <Route path="/vitalForm" element={<VitalForm />}></Route>
      <Route path="/recommendation" element={<HealthRecommendation />}></Route>
      <Route path="/fileupload" element={<FileUpload />}></Route>
      <Route path="/dietPlan/:userId" element={<DietPlan />}></Route>
      <Route path="/exercise/:userId" element={<ExercisePlan />}></Route> 
      </Routes>
    </Router>
  )
}

export default App
