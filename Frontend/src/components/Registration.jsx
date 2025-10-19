import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { AuthContext } from '../context/AuthContext';



const Registration = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await register(`${formData.first_name} ${formData.last_name}`, formData.email, formData.password);
      if (data && data.userId) {
        alert('Registration successful! Please login.');
        navigate('/auth');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <form
  onSubmit={handleSubmit}
  className="bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 rounded-xl w-1/2 max-w-[20rem] flex flex-col justify-center items-center p-6 shadow-xl text-white"
  autoComplete="off"
>


        <h1 className="text-3xl font-bold text-center mb-6">Registration</h1>

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="mb-4 p-2 border rounded w-[80%]"
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="mb-4 p-2 border rounded w-[80%] "
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mb-4 p-2 border rounded w-[80%]"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mb-4 p-2 border rounded w-[80%]"
        />

       
        <Button type="submit" disabled={loading} className='w-[80%]'>{loading ? 'Registering...' : 'Register'}</Button>

      </form>
    </div>

  );
};

export default Registration;