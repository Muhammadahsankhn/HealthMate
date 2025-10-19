import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const AddVitals = () => {
  const { authFetch } = useContext(AuthContext);
  const [form, setForm] = useState({
    bp: "",
    sugar: "",
    weight: "",
    date: "",
    notes: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await authFetch("/vitals/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Vital saved successfully!");
      navigate("/timeline");
    } else alert(data.error || "Failed to save vitals.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100">
      <NavBar />
      <div className="flex justify-center items-center py-10 px-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-indigo-100">
          <h1 className="text-3xl font-bold text-indigo-600 text-center mb-6">
            Add Manual Vitals
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-gray-700"
            autoComplete="off"
          >
            <div>
              <label className="block text-sm font-semibold mb-1">Blood Pressure (BP)</label>
              <input
                placeholder="e.g. 120/80"
                value={form.bp}
                onChange={(e) => setForm({ ...form, bp: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Sugar Level (mg/dL)</label>
              <input
                placeholder="e.g. 95"
                value={form.sugar}
                onChange={(e) => setForm({ ...form, sugar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Weight (kg)</label>
              <input
                placeholder="e.g. 68"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Notes</label>
              <textarea
                placeholder="Any additional information..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-gradient-to-r from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 
                         text-white font-semibold py-2 rounded-lg shadow-lg transition-all duration-300 
                         hover:shadow-indigo-200"
            >
              💾 Save Vitals
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVitals;
