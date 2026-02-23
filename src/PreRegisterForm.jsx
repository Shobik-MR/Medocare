import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PreRegisterForm() {
 const navigate = useNavigate();
  const location = useLocation();
  const hospital = location.state?.hospital;

  const [showButtons, setShowButtons] = useState(false);

  const [patient, setPatient] = useState({
    patientName: "",
    age: "",
    problem: ""
  });

  // 🛑 Direct open without hospital
  if (!hospital) {
    return <h2>No hospital selected</h2>;
  }

  // 🧭 Navigation button click
  const handleNavigation = () => {
    if (!hospital.location?.lat || !hospital.location?.lng) {
      alert("Hospital location not available");
      return;
    }

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`
    );
  };

  // 📝 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/preregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hospitalName: hospital.hospitalName,
          patientName: patient.patientName,
          age: patient.age,
          problem: patient.problem
        })
      });

      const data = await res.json();

      console.log(data); // 🔍 debug

      if (data.success) {
        alert("Pre-registration successful ✅");

        setShowButtons(true); // ⭐ SHOW BUTTONS

        // optional → clear form
        setPatient({
          patientName: "",
          age: "",
          problem: ""
        });
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="preRegFormPage">
      <h2 className="h2p">Pre-Register  {hospital?.hospitalName}</h2>
      <form className="form2" onSubmit={handleSubmit}
    >
        <input
          type="text"
          placeholder="Your Name"
          value={patient.patientName}
          onChange={(e) => setPatient({ ...patient, patientName: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={patient.age}
          onChange={(e) => setPatient({ ...patient, age: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Problem / Reason"
          value={patient.problem}
          onChange={(e) => setPatient({ ...patient, problem: e.target.value })}
          required
        />
        <button className="btn4" type="submit">Submit</button>
        <button className="btn4" type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
     {showButtons && (
        <div className="successBoxContainer">

          <button className="successBox" onClick={handleNavigation}>
            Navigation
          </button>

          <button
            className="successBox"
            onClick={() => navigate("/chatbot")}
          >
            Assistance
          </button>

        </div>
      )}
    </div>
  );
}

export default PreRegisterForm;