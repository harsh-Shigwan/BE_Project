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
import Home from './blockchain/Home.jsx'

import Upload from "./artifacts/contracts/Upload.sol/Upload.json"
import ChatBotAI from './chatbot/ChatBotAI.JSX'
import Pre from './Prescription/Pre.jsx'
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
      <Route path="/blockchain_store" element={<Home/>}></Route>
      <Route path="/medi_chatbot" element={<ChatBotAI/>}></Route>
      <Route path='/prescription' element={<Pre/>} />
      </Routes>
    </Router>
  )
}

export default App
