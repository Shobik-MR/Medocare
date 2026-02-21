import { useState, useEffect } from "react";
import "./index.css";

function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

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

 const filtered = data.filter((h) =>
  h.hospitalName?.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="dashboard">
      <input className="DS1"
        type="text"
        placeholder="Search hospital..."
        onChange={(e) => setSearch(e.target.value)}
      />

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
