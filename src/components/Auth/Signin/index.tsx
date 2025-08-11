"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const Signin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("b2c");
  const [currentStep, setCurrentStep] = useState(1);
  const [isResetting, setIsResetting] = useState(false);

  const [email, setEmail] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const [b2cEmail, setB2cEmail] = useState("");
  const [b2cPassword, setB2cPassword] = useState("");



  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setCurrentStep(1);
      setEmail("");
      setGeneratedOtp("");
      setUserOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setIsResetting(false);
    }, 300);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    alert(`For demonstration purposes, your OTP is: ${randomOtp}`);
    setCurrentStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword || newPassword === "") {
      setPasswordError("Passwords do not match or are empty.");
      return;
    }
    setPasswordError("");
    setIsResetting(true);
    setTimeout(() => {
      handleCloseModal();
    }, 3000);
  };

  useEffect(() => {
    if (currentStep === 3 && newPassword !== "" && confirmPassword !== "") {
      if (newPassword === confirmPassword) {
        setPasswordError("");
      } else {
        setPasswordError("Passwords do not match.");
      }
    }
  }, [newPassword, confirmPassword, currentStep]);

  const modalBgColor = modalType === "b2c" ? "bg-white" : "bg-dark";
  const modalTextColor = modalType === "b2c" ? "text-dark" : "text-white";
  const inputBgColor =
    modalType === "b2c"
      ? "bg-gray-1 border-gray-3 placeholder:text-dark-5"
      : "bg-gray-2/20 border-gray-7 text-white placeholder:text-gray-5";
  const buttonColor =
    modalType === "b2c"
      ? "bg-dark hover:bg-blue"
      : "bg-blue hover:bg-blue/90";

  return (
    <>
      <Breadcrumb title={"Sign In"} pages={["Sign In"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row items-stretch gap-8 xl:gap-10">
            <div className="w-full lg:w-1/2">
              <div className="h-full rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
                <div className="text-center mb-11">
                  <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                    Customer Sign In
                  </h2>
                  <p>Enter your details below to continue</p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    //const email = document.getElementById("b2c-email").value;
                    //const password = document.getElementById("b2c-password").value;

                    try {
                      const res = await fetch("https://mahaveerbe.vercel.app/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          b2cEmail: b2cEmail,
                          b2cPassword: b2cPassword,
                          userType: "b2c"
                        }),
                      });


                      const data = await res.json();

                      if (res.ok) {
                        localStorage.setItem("user", JSON.stringify(data));
                        router.push("/");
                      } else {
                        alert(data.error || "Login failed");
                      }
                    } catch (err) {
                      console.error(err);
                      alert("Something went wrong");
                    }
                  }}
                >

                  <div className="mb-5">
                    <label htmlFor="b2c-email" className="block mb-2.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="b2c-email"
                      id="b2c-email"
                      placeholder="Enter your email"
                      value={b2cEmail}
                      onChange={(e) => setB2cEmail(e.target.value)}
                      className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <div className="mb-5">
                    <label htmlFor="b2c-password" className="block mb-2.5">
                      Password
                    </label>
                    <input
                      type="password"
                      name="b2c-password"
                      id="b2c-password"
                      placeholder="Enter your password"
                      value={b2cPassword}
                      onChange={(e) => setB2cPassword(e.target.value)}
                      className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                  >
                    Sign In to Account
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenModal("b2c")}
                    className="block w-full text-center text-dark-4 mt-4.5 ease-out duration-200 hover:text-dark"
                  >
                    Forget your password?
                  </button>

                  <p className="text-center mt-6">
                    Don&#39;t have an account?
                    <Link
                      href="/signup"
                      className="text-dark ease-out duration-200 hover:text-blue pl-2"
                    >
                      Sign Up Now!
                    </Link>
                  </p>
                </form>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="h-full rounded-xl bg-dark shadow-1 p-4 sm:p-7.5 xl:p-11">
                <div className="text-center mb-11">
                  <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-white mb-1.5">
                    Business Sign In
                  </h2>
                  <p className="text-gray-4">Enter your partner credentials</p>
                </div>

                <form>
                  <div className="mb-5">
                    <label
                      htmlFor="b2b-email"
                      className="block mb-2.5 text-white"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="b2b-email"
                      id="b2b-email"
                      placeholder="Enter your business email"
                      className="rounded-lg border border-gray-7 bg-gray-2/20 text-white placeholder:text-gray-5 w-full py-3 px-5 outline-none duration-200 focus:border-blue focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="b2b-password"
                      className="block mb-2.5 text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="b2b-password"
                      id="b2b-password"
                      placeholder="Enter your password"
                      autoComplete="on"
                      className="rounded-lg border border-gray-7 bg-gray-2/20 text-white placeholder:text-gray-5 w-full py-3 px-5 outline-none duration-200 focus:border-blue focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue/90 mt-7.5"
                  >
                    Sign In to Partner Portal
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenModal("b2b")}
                    className="block w-full text-center text-gray-4 mt-4.5 ease-out duration-200 hover:text-white"
                  >
                    Forget your password?
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className={`relative rounded-xl shadow-lg p-8 w-full max-w-md mx-4 ${modalBgColor} ${modalTextColor}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className={`absolute top-4 right-4 ${modalType === "b2c" ? "text-gray-500" : "text-gray-300"
                } hover:text-red-500`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            {currentStep === 1 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
                <p className="mb-6">
                  Enter your email address and we will send you an OTP to reset
                  your password.
                </p>
                <form onSubmit={handleEmailSubmit}>
                  <label htmlFor="reset-email" className="block mb-2.5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="reset-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className={`rounded-lg border w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${inputBgColor}`}
                  />
                  <button
                    type="submit"
                    className={`w-full flex justify-center font-medium text-white py-3 px-6 rounded-lg ease-out duration-200 mt-6 ${buttonColor}`}
                  >
                    Send OTP
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Enter OTP</h3>
                <p className="mb-6">
                  Please check your email for a 6-digit One-Time Password.
                </p>
                <form onSubmit={handleOtpSubmit}>
                  <label htmlFor="otp" className="block mb-2.5">
                    OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={userOtp}
                    onChange={(e) => setUserOtp(e.target.value)}
                    placeholder="Enter the 6-digit code"
                    required
                    maxLength={6}
                    className={`rounded-lg border w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${inputBgColor}`}
                  />
                  <button
                    type="submit"
                    className={`w-full flex justify-center font-medium text-white py-3 px-6 rounded-lg ease-out duration-200 mt-6 ${buttonColor}`}
                  >
                    Verify OTP
                  </button>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Set New Password</h3>
                <form onSubmit={handlePasswordReset}>
                  <div className="mb-5">
                    <label htmlFor="new-password" className="block mb-2.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className={`rounded-lg border w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${inputBgColor}`}
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="confirm-password" className="block mb-2.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className={`rounded-lg border w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${inputBgColor}`}
                    />
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-2">
                      {passwordError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isResetting}
                    className={`w-full flex justify-center items-center font-medium text-white py-3 px-6 rounded-lg ease-in-out duration-300 mt-6 ${isResetting
                      ? "bg-green-500 cursor-not-allowed"
                      : buttonColor
                      }`}
                  >
                    {isResetting ? (
                      <span className="flex items-center">
                        <svg
                          className="w-6 h-6 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Success!
                      </span>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Signin;