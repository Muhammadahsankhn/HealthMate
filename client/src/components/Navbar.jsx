import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showRecordsDropdown, setShowRecordsDropdown] = useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id || decoded._id,
          username: decoded.username,
          email: decoded.email,
        });
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowHamburgerMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProfileClick = () => setShowProfile((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowProfile(false);
    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-md relative">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-[#B9FF66]">HealthMate</h1>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center relative">
        <Link to="/" className="text-gray-700 hover:text-[#B9FF66] transition">
          Home
        </Link>

        {/* Records Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowRecordsDropdown(true)}
          onMouseLeave={() => setShowRecordsDropdown(false)}
        >
          <button className="text-gray-700 hover:text-[#B9FF66] transition">
            Records
          </button>

          <AnimatePresence>
            {showRecordsDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bg-white shadow-md rounded-xl mt-2 py-2 w-48 z-50 border border-gray-100"
              >
                <Link
                  to="/vitals-record"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#B9FF66]/20"
                >
                  Vitals Record
                </Link>
                <Link
                  to="/report-record"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#B9FF66]/20"
                >
                  Report Record
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Upload Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowUploadDropdown(true)}
          onMouseLeave={() => setShowUploadDropdown(false)}
        >
          <button className="text-gray-700 hover:text-[#B9FF66] transition">
            Upload
          </button>

          <AnimatePresence>
            {showUploadDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bg-white shadow-md rounded-xl mt-2 py-2 w-48 z-50 border border-gray-100"
              >
                <Link
                  to="/vitals-upload"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#B9FF66]/20"
                >
                  Vitals Upload
                </Link>
                <Link
                  to="/report-upload"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#B9FF66]/20"
                >
                  Report Upload
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        {user ? (
          <>
            <div
              onClick={handleProfileClick}
              className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition"
            >
              {user.username?.charAt(0).toUpperCase()}
            </div>

            <AnimatePresence>
              {showProfile && (
                <>
                  <motion.div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowProfile(false)}
                  />

                  <motion.div
                    className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 z-50 flex flex-col"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold">Profile</h3>
                      <button
                        onClick={() => setShowProfile(false)}
                        className="text-xl text-gray-500 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>

                      <h4 className="text-xl font-semibold">{user.username}</h4>
                      <p className="text-gray-600">{user.email}</p>

                      <div className="mt-6 w-full border-t pt-4 text-sm text-gray-600">
                        <p>
                          <strong>User ID:</strong> {user.id}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="mt-auto bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        ) : (
          <Link to="/auth">
            <Button className="bg-[#B9FF66] text-black hover:bg-[#A7FF40] px-4 py-2 rounded-xl">
              Get Started
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden"
        onClick={() => setShowHamburgerMenu((prev) => !prev)}
      >
        <Menu />
      </button>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {showHamburgerMenu && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl p-6 z-50 md:hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Menu</h3>
              <button onClick={() => setShowHamburgerMenu(false)}>✕</button>
            </div>

            <div className="flex flex-col gap-4">
              <Link to="/" onClick={() => setShowHamburgerMenu(false)}>Home</Link>
              <Link to="/vitals-record" onClick={() => setShowHamburgerMenu(false)}>Vitals Record</Link>
              <Link to="/report-record" onClick={() => setShowHamburgerMenu(false)}>Report Record</Link>
              <Link to="/vitals-upload" onClick={() => setShowHamburgerMenu(false)}>Vitals Upload</Link>
              <Link to="/report-upload" onClick={() => setShowHamburgerMenu(false)}>Report Upload</Link>

              {/* User Profile */}
              {user ? (
                <>
                  <div
                    onClick={handleProfileClick}
                    className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition"
                  >
                    {user.username?.charAt(0).toUpperCase()}
                  </div>

                  <AnimatePresence>
                    {showProfile && (
                      <>
                        <motion.div
                          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowProfile(false)}
                        />

                        <motion.div
                          className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 z-50 flex flex-col"
                          initial={{ x: "100%" }}
                          animate={{ x: 0 }}
                          exit={{ x: "100%" }}
                          transition={{ type: "spring", stiffness: 80, damping: 18 }}
                        >
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">Profile</h3>
                            <button
                              onClick={() => setShowProfile(false)}
                              className="text-xl text-gray-500 hover:text-red-500"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                              {user.username?.charAt(0).toUpperCase()}
                            </div>

                            <h4 className="text-xl font-semibold">{user.username}</h4>
                            <p className="text-gray-600">{user.email}</p>

                            <div className="mt-6 w-full border-t pt-4 text-sm text-gray-600">
                              <p>
                                <strong>User ID:</strong> {user.id}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={handleLogout}
                            className="mt-auto bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                          >
                            Logout
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link to="/auth">
                  <Button className="bg-[#B9FF66] text-black hover:bg-[#A7FF40] px-4 py-2 rounded-xl">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
