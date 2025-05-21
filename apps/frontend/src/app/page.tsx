/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Home() {
  const router = useRouter();

  const [registerFormData, setRegisterFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [registerError, setRegisterError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleRegisterChange = (e: any) => {
    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginChange = (e: any) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleRegisterSubmit(e: any) {
    e.preventDefault();

    if (
      !registerFormData.first_name ||
      !registerFormData.last_name ||
      !registerFormData.password ||
      !registerFormData.email
    ) {
      setRegisterError("Please complete registration form!");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerFormData), // The data you want to send
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user_id", data.first_name);
        localStorage.setItem("user_id", data.last_name);
        localStorage.setItem("user_id", data.email);
        localStorage.setItem("user_id", data.role);
        localStorage.setItem("user_id", data.access_token);
        router.push(`./submit`);
      }
    } catch (error) {
      console.error(error);
      setRegisterError("Error trying to register!");
    }
  }

  async function handleLoginSubmit(e: any) {
    e.preventDefault();

    console.log(loginFormData);

    if (!loginFormData.password || !loginFormData.email) {
      setLoginError("Please complete login form!");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginFormData), // The data you want to send
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user_id", data.first_name);
        localStorage.setItem("user_id", data.last_name);
        localStorage.setItem("user_id", data.email);
        localStorage.setItem("user_id", data.role);
        localStorage.setItem("user_id", data.access_token);
        router.push(`./submit`);
      }
    } catch (error) {
      console.error(error);
      setRegisterError("Error trying to login!");
    }
  }

  return (
    <div className="p-5 text-black flex flex-col w-full h-screen justify-center items-center bg-white space-y-10">
      <h1 className="p-5 text-5xl font-bold border shadow rounded-full">
        Software Practice Empirical Evidence Database
      </h1>
      <div className="flex my-5 w-2/3 space-x-5">
        <form
          className="w-1/2 flex flex-col space-y-3"
          onSubmit={handleRegisterSubmit}
        >
          <h2>Register Here:</h2>
          <input
            type="text"
            name="first_name"
            className="bg-blue-200 text-gray-500 h-10 p-1 rounded"
            value={registerFormData.first_name}
            onChange={handleRegisterChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="last_name"
            className="bg-blue-200 text-gray-500 h-10 p-1 rounded"
            value={registerFormData.last_name}
            onChange={handleRegisterChange}
            placeholder="Last Name"
          />
          <input
            type="text"
            name="email"
            className="bg-blue-200 text-gray-500 h-10 p-1 rounded"
            value={registerFormData.email}
            onChange={handleRegisterChange}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            className="bg-blue-200 text-gray-500 h-10 p-1 rounded"
            value={registerFormData.password}
            onChange={handleRegisterChange}
            placeholder="Password"
          />
          <div className="w-full text-sm text-red-400">
            <p>{registerError}</p>
          </div>
          <button
            type="submit"
            className="w-full h-16 bg-blue-500 hover:bg-blue-300 rounded-xl"
          >
            REGISTER
          </button>
        </form>
        <form
          className="w-1/2 flex flex-col space-y-3"
          onSubmit={handleLoginSubmit}
        >
          <h2>Or login here:</h2>
          <input
            type="text"
            name="email"
            className="bg-blue-200 text-gray-500 h-10 p-1 rounded"
            value={loginFormData.email}
            onChange={handleLoginChange}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            className="bg-blue-200 text-gray-500 h-10 p-1 rounded"
            value={loginFormData.password}
            onChange={handleLoginChange}
            placeholder="Password"
          />
          <div className="w-full text-sm text-red-400">
            <p>{loginError}</p>
          </div>
          <button
            type="submit"
            className="w-full h-16 bg-blue-500 hover:bg-blue-300 rounded-xl"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
