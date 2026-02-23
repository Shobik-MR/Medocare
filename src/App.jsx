import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Medocare from "./Medocare";
import Admin from "./Admin";
import HospitalForm from "./HospitalForm";
import Dashboard from "./Dashboard";
import FindHospital from "./FindHospital";
import PreRegisterForm from "./PreRegisterForm";
import ChatBot from "./ChatBot";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Medocare />} />
      <Route path="/Admin" element={<Admin />} />
      <Route path="/hospitalform" element={<HospitalForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/findhospital" element={<FindHospital />} />
      <Route path="/preregister" element={<PreRegisterForm />} />
      <Route path="/assistance" element={<ChatBot />} />
    </Routes>
  );
}

export default App;