import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
            <NavBar />

            <header className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-sky-800">HealthMate</h1>
                    <p className="mt-4 text-lg text-slate-700">Sehat ka Smart Dost — your bilingual personal health companion.</p>

                    <div className="mt-8 flex gap-4">
                        <button onClick={() => navigate('/auth')} className="px-6 py-3 bg-sky-600 text-white rounded-md shadow">Get Started</button>
                        <button onClick={() => navigate('/dashboard')} className="px-6 py-3 border border-sky-600 text-sky-600 rounded-md">Dashboard</button>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="rounded-xl shadow-lg overflow-hidden bg-white">
                        <img src="https://static.vecteezy.com/system/resources/previews/048/776/455/non_2x/be-healthy-advice-on-pink-sticky-note-near-stethoscope-and-tablets-photo.jpg" alt="health" className="w-full h-64 object-cover" />
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pb-24">
                <section className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="font-semibold">Upload Reports</h3>
                        <p className="mt-2 text-sm text-slate-600">Upload your medical images and PDFs. HealthMate will analyze and summarize in English and Roman Urdu.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="font-semibold">Track Vitals</h3>
                        <p className="mt-2 text-sm text-slate-600">Log BP, sugar, weight and view trends over time.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="font-semibold">Timeline & Insights</h3>
                        <p className="mt-2 text-sm text-slate-600">See a merged timeline of AI reports and manual vitals with doctor questions and diet tips.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
