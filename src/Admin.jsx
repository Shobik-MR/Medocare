import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

 function Admin() {
  /*changes*/
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  const [form, setForm] = useState({
    hospitalName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignup
      ? "http://localhost:5000/api/admin/signup"
      : "http://localhost:5000/api/admin/login";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    // 👉 SIGNUP
    if (isSignup && data.success) {
      alert("Signup success — now login");
      setIsSignup(false);
      return;
    }

    // 👉 LOGIN
    if (!isSignup && data.success) {
      navigate("/hospitalform", {
        state: {
          token: data.token,
        },
      });
    }
  };


 
/*changes*/

  return (
    <div className="admin-container">
      <div className="admin-card">

        <h2>{isSignup ? "Hospital Signup" : "Admin Login"}</h2>

        <form  onSubmit={handleSubmit}>

          {isSignup && (
            <input type="text" placeholder="Hospital Name" required 
            onChange={(e) =>
      setForm({ ...form, hospitalName: e.target.value })
    }/>
          )}
         
          <input type="email" placeholder="Email Address" required 
          onChange={(e) =>
      setForm({ ...form, email: e.target.value })
    }/>
          <input type="password" placeholder="Password" required 
          onChange={(e) =>
      setForm({ ...form, password: e.target.value })
    }
 />

          <button className="login-btn" type="submit">
            {isSignup ? "Sign Up" : "Login"}
          </button>

        </form>

        <p className="toggle-text">
          {isSignup ? "Already have an account?" : "New hospital?"}

          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Login" : " Sign up"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default Admin;