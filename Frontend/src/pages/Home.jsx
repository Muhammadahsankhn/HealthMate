import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

    const Authentication = () => {
        navigate('/auth')
    }
    return (
        <>
            {/* This bar will scroll away */}
            <div className='h-6 bg-amber-500 text-amber-200 flex justify-center items-center text-center'>
                Welcome to the app
            </div>

            {/* Sticky Navbar */}
            <div className="w-full bg-zinc-300 text-zinc-900 text-lg py-3 px-6 shadow-md sticky top-0 z-50">
                <div className="flex justify-between items-center max-w-7xl mx-auto">

                    {/* Left Side Nav Items */}
                    <div className="flex gap-8 font-medium">
                        <button className="hover:text-blue-600 transition">Home</button>
                        <button className="hover:text-blue-600 transition">Contact</button>
                        <button className="hover:text-blue-600 transition">About</button>
                    </div>

                    {/* Right Side Auth Buttons */}
                    <div className="flex gap-4">
                        <input
                            type="button"
                            value="Get Started"
                            onClick={Authentication}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="min-h-screen bg-zinc-900 flex flex-col p-6 ">
                <div className='w-full '>
                    <p className="text-4xl  text-gray-100 mb-4">
                        Humanitarian Innovation Hub
                    </p>
                    <h1 className="text-[6rem]  text-gray-400 mb-8  font-extrabold">
                        Bringing Solutions to those Changing the World
                    </h1>
                </div>

                <div className='w-full flex justify-between items-center'>
                    <div className='w-1/2 '>
                        <button className='border px-6 py-3 text-white text-2xl rounded-3xl'>Learn More</button>
                    </div>

                    <div className='w-1/2'>
                        <p className='w-3/4 text-white'>Humanitarians & Geeks. We are passionate about innovation. We believe that technological products can significantly enhance the impact of nonprofits and NGOs. Providing the right tools to the right people can make a real difference.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
