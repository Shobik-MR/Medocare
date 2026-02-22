
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import "./index.css";
  function HospitalForm({}) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token;

  const [form, setForm] = useState({
  hospitalName: "",
  beds: "",
  doctors: "",
  emergency: "",
  ambulance: "",
});

const [status, setStatus] = useState("");
const [preRegs, setPreRegs] = useState([]);




  
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
  
 

const updateStatus = async (id, status) => {
  try {
    const res = await fetch(`http://localhost:5000/prehospital/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setPreRegs(prev => prev.map(p => (p._id === id ? updated : p)));
  } catch (err) {
    console.log(err);
  }
};


  // 🔐 protect page
  useEffect(() => {
    if (!token) navigate("/");
  }, [token]);

 useEffect(() => {
  if (!form.hospitalName) return;

  fetch(`http://localhost:5000/prehospital/${form.hospitalName}`)
    .then(res => res.json())
    .then(data => setPreRegs(data))
    .catch(err => console.log(err));
}, [form.hospitalName]);


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


    //pre-register
    




    //pre-register
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
 
   <div className="preRegContainer">
<h3>Pre-Registered Patients</h3>
{preRegs.length === 0 ? (
  <p>No pre-registrations yet</p>
) : (
  preRegs.map(p => (
    <div key={p._id} className="preRegCard">
      <p>Name: {p.patientName}</p>
      <p>Age: {p.age}</p>
      <p>Problem: {p.problem}</p>
      <p>Status: {p.status}</p>
      {p.status === "pending" && (
        <>
          <button  className="btn4" onClick={() => updateStatus(p._id, "accepted")}>Accept</button>
          <button className="btn4" onClick={() => updateStatus(p._id, "cancelled")}>Cancel</button>
        </>
      )}
    </div>
  ))
  )}
  </div>
     </div>

  );
}







 
export default HospitalForm;