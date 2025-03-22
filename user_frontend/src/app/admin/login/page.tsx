"use client";
import { useState } from "react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-2xl w-96">
        <h2 className="text-4xl font-normal text-black mb-6 font-['Be_Vietnam_Pro'] text-center">
          Admin Login
        </h2>

        <form className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-lg font-medium font-['Be_Vietnam_Pro']"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium font-['Be_Vietnam_Pro']"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white text-lg font-medium rounded-lg hover:bg-purple-700 transition font-['Be_Vietnam_Pro']"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
