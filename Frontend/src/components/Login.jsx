import React, { useState, useContext } from 'react';
import InputField from './Input';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(formData.email, formData.password);
            if (result.ok) {
                alert('Login successful');
                navigate('/dashboard');
            } else {
                alert(result.error || 'Login failed');
            }

        } catch (err) {
            console.error('Login error:', err);
            alert('Server error during login');
        }
    };

    return (
        <div className="">
            <form
  onSubmit={handleSubmit}
  className="bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 rounded-2xl w-full max-w-md flex flex-col justify-center items-center p-6 shadow-xl text-white"
  autoComplete="off"
>

                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

                <InputField
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <InputField
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <Button type="submit" className='w-[80%]'>Login</Button>


            </form>
        </div>
    );
};

export default Login;