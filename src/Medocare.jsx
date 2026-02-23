
import { useNavigate } from "react-router-dom";
import './index.css';

 function Medocare() {
  const navigate = useNavigate();
  return (
    <div className="container">

      {/* Header */}
      <header className="navbar">
        <h1 className="logo">MedoCare</h1>
        <button className="admin-btn" onClick={() => navigate("/Admin")}>Admin Login</button>
      </header>

      {/* Hero */}
      <section className="hero">
        <h2>Medocare </h2>
        <p>Find hospitals • Book ambulance • Real-time emergency support</p>
      </section>

      {/* Services */}
      <section className="services">

        <div className="card">
          <h3>Ambulance Services</h3>
          
          <button>Book Ambulance</button>
        </div>

        <div className="card">
          <h3> Find Hospital</h3>
          
          <button onClick={() => navigate("/findhospital")}>Search Hospital</button>
        </div>

        <div className="card">
          <h3>Hospital Dashboard</h3>
          
            <button onClick={() => navigate("/Dashboard")}>View Dashboard</button>
        </div>

      </section>

      {/* Emergency Call */}
      <section className="call-section">
        <button className="call-btn">Call Emergency</button>
      </section>

    </div>
  );
}




export default Medocare;