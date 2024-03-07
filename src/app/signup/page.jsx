"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../authContext";
const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: '', email: '', password: '' });
  const { signup } = useAuth();
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let validationErrors = {};
    let formIsValid = true;

    // Username validation
    if (!username || username.length < 3) {
      validationErrors = { ...validationErrors, username: 'Username must be at least 3 characters' };
      formIsValid = false;
    }

    // Email validation
    if (!email || !validateEmail(email)) {
      validationErrors = { ...validationErrors, email: 'Invalid email format' };
      formIsValid = false;
    }

    // Password validation
    if (!password || password.length < 6) {
      validationErrors = { ...validationErrors, password: 'Password must be at least 6 characters' };
      formIsValid = false;
    }
    // @ts-ignore
    setErrors(validationErrors);

    if (formIsValid) {
      const success = await signup(username, email, password);
      if (success) {
        console.log("Signed up successfully");
        router.push('/');
      } else {
        alert("Signup failed");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-md w-full"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center text-2xl font-extrabold text-gray-800 mb-6">Sign Up</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className="text-red-500 text-xs italic">{errors.username}</p>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-red-500 text-xs italic">{errors.email}</p>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
           <p className="text-red-500 text-xs italic">{errors.password}</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Sign Up
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <a
            href="/login" // Replace with your login page route
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
