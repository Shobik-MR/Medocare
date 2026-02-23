import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function FindHospital() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [emergencyFilter, setEmergencyFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Navigate to pre-register page
  const goToPreRegister = (hospital) => {
   navigate("/preregister", { state: { hospital } });
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

  useEffect(() => {

    let result = data;

    // 🔍 search by hospital name
    if (search) {
      result = result.filter((item) =>
        item.hospitalName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🚑 emergency filter
    if (emergencyFilter) {
      result = result.filter(
        (item) => item.emergency === emergencyFilter
      );
    }

    setFiltered(result);

  }, [search, emergencyFilter, data]);

  if (loading) return <h2>Loading hospitals...</h2>;

  return (
    <div className="dashboard">
      <h2 className="h2p">Available Hospitals</h2>
            <div className="searchFilter">

        <input
          type="text"
          placeholder="Search hospital..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={emergencyFilter}
          onChange={(e) => setEmergencyFilter(e.target.value)}
        >
          <option value="">All Emergency</option>
          <option value="Cardiac">Cardiac</option>
          <option value="Accident">Accident</option>
          <option value="General">General</option>
        </select>

      </div>


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

{item.location && (
  <>
    <p>Latitude: {item.location.lat}</p>
    <p>Longitude: {item.location.lng}</p>
  </>
)}

            <button className="btn3" onClick={() => goToPreRegister(item)}>
              Pre-Register
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default FindHospital;