import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function FindHospital() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Navigate to pre-register page
  const goToPreRegister = (hospitalName) => {
    navigate("/preregister", { state: { hospitalName } });
  };

  // Fetch all hospitals
  useEffect(() => {
    fetch("http://localhost:5000/gethospitals")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading hospitals...</h2>;

  return (
    <div className="dashboard">
      <h2 className="h2p">Available Hospitals</h2>

      {data.length === 0 ? (
        <p>No hospitals available</p>
      ) : (
        data.map((item, index) => (
          <div key={index} className="card2">
            <h3>{item.hospitalName}</h3>
            <p>Beds: {item.beds}</p>
            <p>Doctors: {item.doctors}</p>
            <p>Emergency: {item.emergency}</p>
            <p>Ambulance: {item.ambulance}</p>

            <button className="btn3" onClick={() => goToPreRegister(item.hospitalName)}>
              Pre-Register
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default FindHospital;