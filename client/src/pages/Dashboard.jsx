import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Decode the token payload
      const decoded = jwtDecode(token);
      console.log(decoded);
      
      setUser(decoded);
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/auth");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          🩺 Health<span className="text-green-500">Mate</span> Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </nav>

      <main className="flex-1 p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome{user ? `, ${user.username}` : ""} 👋
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-gray-800">Profile Info</h3>
            <p className="text-gray-600 mt-2">
              <strong>Email:</strong> {user?.email || "Loading..."}
            </p>
            
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-gray-800">Health Stats</h3>
            <p className="text-gray-600 mt-2">
              Coming soon — track your fitness, heart rate, and health reports.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-gray-800">File Uploads</h3>
            <p className="text-gray-600 mt-2">
              View and manage your uploaded reports and prescriptions.
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 bg-gray-100 text-gray-500">
        © {new Date().getFullYear()} HealthMate | Designed by Ahsan 💚
      </footer>
    </div>
  );
};

export default Dashboard;