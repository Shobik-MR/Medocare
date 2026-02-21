import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Medocare from "./Medocare";
import Admin from "./Admin";
import HospitalForm from "./HospitalForm";
import Dashboard from "./Dashboard";

function App() {
 

  return (
    <Routes>
      <Route path="/" element={<Medocare />} />
      <Route path="/Admin" element={<Admin />} />

       <Route path="/hospitalform" element={<HospitalForm />} />
  <Route path="/Dashboard" element={<Dashboard />} />
  </Routes>
  );
}

export default App;
