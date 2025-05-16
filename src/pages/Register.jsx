import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setphone] = useState("");
    const [age, setAge] = useState("");
    const navigate = useNavigate();

    const requestRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    phone,
                    age,
                    address: {
                        street: "None",
                        city: "None",
                        state: "None",
                        country: "None",
                    },
                    role: "user",
                    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgJ0xLgjNQgjMLPh2FaBZ-s7wjHOJZNBJxYw&s`",
                }),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success("Registration successful! Redirecting...");
                setTimeout(() => navigate('/'), 2000);
                console.log(result);
            } else {
                const error = await response.json();
                toast.error(error.message || "Registration failed! Please try again.");
            }
        } catch (err) {
            toast.error("An error occurred. Please try again.");
        } finally {
            // Reset form inputs
            setAge("");
            setEmail("");
            setFirstName("");
            setLastName("");
            setPassword("");
            setphone("");
        }
    };

    return (
        <div className="flex h-screen bg-white">
            <div className="w-4/6 flex flex-col items-center justify-center bg-orange-500">
                <img src="./bg.png" alt="Background" />
            </div>
            <div className="flex gap-10 flex-col justify-center px-5 flex-1">
                <div>
                    <h1 className="text-4xl mb-2 font-bold text-secondary">Welcome to Register!</h1>
                    <p className="text-secondary text-opacity-55">Chat</p>
                </div>
                <form onSubmit={requestRegister} className="flex flex-col gap-5">
                    <div className="flex gap-2 items-center">
                        <label className="input input-bordered flex items-center gap-2">
                            <input
                                type="text"
                                className="grow"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            <input
                                type="text"
                                className="grow"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="email"
                            className="grow"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="text"
                            className="grow"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setphone(e.target.value)}
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="number"
                            className="grow"
                            placeholder="Age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        className="btn btn-secondary text-white font-semibold uppercase">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
