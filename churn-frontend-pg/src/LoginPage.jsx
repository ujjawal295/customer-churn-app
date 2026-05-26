import { useState } from "react";

export default function LoginPage({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const handleLogin = () => {

    // Demo credentials
    if (
      role === "admin" &&
      email === "admin@gmail.com" &&
      password === "admin123"
    ) {

      onLogin({
        role: "admin",
        name: "Admin"
      });

    }

    else if (
      role === "customer" &&
      email === "customer@gmail.com" &&
      password === "customer123"
    ) {

      onLogin({
        role: "customer",
        name: "Customer"
      });

    }

    else {

      alert("Invalid Credentials");

    }

  };

  return (

    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0A0D14",
      color: "white",
      fontFamily: "sans-serif",
    }}>

      <div style={{
        width: 380,
        background: "#161D2E",
        padding: 40,
        borderRadius: 20,
        border: "1px solid #1E2A3A",
      }}>

        <h1 style={{
          textAlign: "center",
          marginBottom: 10,
        }}>
          Churn AI
        </h1>

        <p style={{
          textAlign: "center",
          color: "#6B7FA3",
          marginBottom: 30,
        }}>
          Login to continue
        </p>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#111827",
              color: "white",
              border: "1px solid #1E2A3A",
            }}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#111827",
              color: "white",
              border: "1px solid #1E2A3A",
            }}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#111827",
              color: "white",
              border: "1px solid #1E2A3A",
            }}
          />

          <button
            onClick={handleLogin}
            style={{
              padding: 14,
              borderRadius: 10,
              border: "none",
              background: "cyan",
              color: "black",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Login
          </button>

        </div>

        <div style={{
          marginTop: 20,
          fontSize: 12,
          color: "#6B7FA3",
        }}>
          <div>Admin → admin@gmail.com / admin123</div>
          <div>Customer → customer@gmail.com / customer123</div>
        </div>

      </div>

    </div>

  );
}