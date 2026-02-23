import { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Medocare from "./Medocare";
import Admin from "./Admin";
import HospitalForm from "./HospitalForm";
import Dashboard from "./Dashboard";
import FindHospital from "./FindHospital";
import PreRegisterForm from "./PreRegisterForm";
import Navigation from "./navigation";
function App() {
 

  return (
    <Routes>
  <Route path="/" element={<Medocare />} />
  <Route path="/Admin" element={<Admin />} />
  <Route path="/hospitalform" element={<HospitalForm />} />
  <Route path="/dashboard" element={<Dashboard />} />
 <Route path="/navigation" element={<Navigation />} />
  <Route path="/findhospital" element={<FindHospital />} />
  <Route path="/preregister" element={<PreRegisterForm />} />
</Routes>

  );
}

export default App;
