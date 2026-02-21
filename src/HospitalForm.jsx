
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import "./index.css";
  function HospitalForm({}) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token;

  // 🔐 protect page
  useEffect(() => {
    if (!token) navigate("/");
  }, [token]);


  const [form, setForm] = useState({
    hospitalName: "",
    beds: "",
    doctors: "",
    emergency: "",
    ambulance: "",
  });

  const [status, setStatus] = useState("");

  
    // 🏥 get hospital data
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/myhospital", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) setForm(data);
      });
  }, [token]);


  // ✅ update
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/addhospital", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setStatus("Updated successfully");
  };

  return (
    <div className="body1">
    <div className="form-container">
      <h2>Update Hospital Status</h2>
    <form onSubmit={handleSubmit}>
      <input className="Hi1"
       
        value={form.hospitalName} readOnly
      />

      <input className="Hi1"
        type="number"
        placeholder="Available Beds"
         value={form.beds}
        onChange={(e) => setForm({ ...form, beds: e.target.value })}
      />

      <input className="Hi1"
        type="number"
        placeholder="Number of Doctors"
        value={form.doctors}
        onChange={(e) => setForm({ ...form, doctors: e.target.value })}
      />
       <input
      className="Hi1"
            placeholder="Emergency Type"
            value={form.emergency}
            onChange={(e) =>
              setForm({ ...form, emergency: e.target.value })
            }
          />

     

      <input className="Hi1"
        placeholder="Ambulance Contact Number"
        value={form.ambulance}
        onChange={(e) => setForm({ ...form, ambulance: e.target.value })}
      />
   
       <button className="btn1" type="submit">
            Update Status
          </button>
       </form>
    </div>
    {status && (
  <div className="status-box">
    {status}
  </div>
)}

    </div>

  );
}
export default HospitalForm;