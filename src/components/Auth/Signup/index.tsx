"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";

const BASE_URL = "https://mahaveerpapersbe.vercel.app";

const Signup = () => {
  const [userType, setUserType] = useState<"b2c" | "b2b">("b2c");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gstNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "gstNumber" ? value.toUpperCase().slice(0, 15) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (userType === "b2b") {
      const pattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
      if (!pattern.test(form.gstNumber)) {
        alert("Enter a valid 15-character GSTIN");
        return;
      }
    }
    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          userType,
          gstNumber: userType === "b2b" ? form.gstNumber : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful");
        setForm({ name: "", email: "", password: "", confirmPassword: "", gstNumber: "" });
        setUserType("b2c");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Breadcrumb title="Signup" pages={["Signup"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-8">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">Create an Account</h2>
              <p>Enter your details below</p>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setUserType("b2c")}
                className={`flex-1 py-2 rounded-lg border ${userType === "b2c" ? "bg-dark text-white" : "bg-white text-dark border-gray-3"}`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setUserType("b2b")}
                className={`flex-1 py-2 rounded-lg border ${userType === "b2b" ? "bg-dark text-white" : "bg-white text-dark border-gray-3"}`}
              >
                Business
              </button>
            </div>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2.5">
                    Full Name <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email Address <span className="text-red">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    required
                  />
                </div>

                {userType === "b2b" && (
                  <div className="mb-5">
                    <label htmlFor="gstNumber" className="block mb-2.5">
                      GST Number <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      id="gstNumber"
                      value={form.gstNumber}
                      onChange={handleChange}
                      placeholder="15-character GSTIN"
                      pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$"
                      title="Enter a valid 15-character GSTIN"
                      className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      required={userType === "b2b"}
                    />
                  </div>
                )}

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Password <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    required
                  />
                </div>

                <div className="mb-5.5">
                  <label htmlFor="confirmPassword" className="block mb-2.5">
                    Re-type Password <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-type your password"
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                >
                  Create Account
                </button>

                <p className="text-center mt-6">
                  Already have an account?
                  <Link href="/signin" className="text-dark ease-out duration-200 hover:text-blue pl-2">
                    Sign in Now
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
