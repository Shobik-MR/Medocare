import { useState, useEffect } from "react";
import "./index.css";

function Dashboard() {
  const [data, setData] = useState([]);
   const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [emergencyFilter, setEmergencyFilter] = useState("");
  

  // ✅ PLACE IT HERE
  useEffect(() => {

    const loadData = () => {
      fetch("http://localhost:5000/gethospitals")
        .then(res => res.json())
        .then(setData);
    };

    loadData();

    const interval = setInterval(loadData, 2000);

    return () => clearInterval(interval);

  }, []);

  // 🔹 SEARCH + FILTER LOGIC
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


  return (
    <div className="dashboard">
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


      {filtered.length === 0 ? (
        <h2>No Data</h2>
      ) : (
        filtered.map((item, index) => (
          <div key={index} className="card2">
            <h2>{item.hospitalName}</h2>
            <p>Beds: {item.beds}</p>
            <p>Doctors: {item.doctors}</p>
            <p>Emergency: {item.emergency}</p>
            <p>Ambulance: {item.ambulance}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
