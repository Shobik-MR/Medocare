import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PreRegisterForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const hospitalName = location.state?.hospitalName;
  const [showButtons, setShowButtons] = useState(false);
  const [patient, setPatient] = useState({ patientName: "", age: "", problem: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/preregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitalName, ...patient }),
      });
      const data = await res.json();
      if (data.success) {
        setShowButtons(true);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to pre-register");
    }
  };

  return (
    <div className="preRegFormPage">
      <h2 className="h2p">Pre-Register for {hospitalName}</h2>
      <form className="form2" onSubmit={handleSubmit}>
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
        <div>
          <button className="successBox" onClick={() => navigate("/navigation")}>
            Navigation
          </button>
          <button
            className="successBox"
            onClick={() =>
              navigate("/assistance", {
                state: {
                  patientName: patient.patientName,
                  age: patient.age,
                  problem: patient.problem,
                  hospitalName,
                },
              })
            }
          >
            Assistance
          </button>
        </div>
      )}
    </div>
  );
}

export default PreRegisterForm;