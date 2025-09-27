"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "https://mahaveerpapersbe.vercel.app";

const API_ROUTES = {
  request: `${BASE_URL}/api/auth/forgot/request`,
  verify: `${BASE_URL}/api/auth/forgot/verify`,
  reset: `${BASE_URL}/api/auth/forgot/reset`,
};

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const head = name.slice(0, 1);
  const tail = name.slice(-1);
  const masked = head + "*".repeat(Math.max(1, name.length - 2)) + tail;
  return `${masked}@${domain}`;
}

const Signin = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string; userId?: string } | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const [b2cEmail, setB2cEmail] = useState("");
  const [b2cPassword, setB2cPassword] = useState("");

  const [b2bEmail, setB2bEmail] = useState("");
  const [b2bPassword, setB2bPassword] = useState("");
  const [b2bGst, setB2bGst] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"b2c" | "b2b">("b2c");
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{ type: "error" | "success" | "info"; msg: string } | null>(null);

  const [canResendAt, setCanResendAt] = useState<number | null>(null);
  const secondsLeft = useMemo(() => {
    if (!canResendAt) return 0;
    const diff = Math.ceil((canResendAt - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  }, [canResendAt]);
  useEffect(() => {
    if (!canResendAt) return;
    const t = setInterval(() => {}, 1000);
    return () => clearInterval(t);
  }, [canResendAt]);

  const modalBgColor = modalType === "b2c" ? "bg-white" : "bg-dark";
  const modalTextColor = modalType === "b2c" ? "text-dark" : "text-white";
  const inputBgColor =
    modalType === "b2c"
      ? "bg-gray-1 border-gray-3 placeholder:text-dark-5"
      : "bg-gray-2/20 border-gray-7 text-white placeholder:text-gray-5";
  const buttonColor = modalType === "b2c" ? "bg-dark hover:bg-blue" : "bg-blue hover:bg-blue/90";

  const resetModalState = () => {
    setCurrentStep(1);
    setEmail("");
    setUserOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setBanner(null);
    setLoading(false);
    setCanResendAt(null);
  };
  const handleOpenModal = (type: "b2c" | "b2b") => {
    setModalType(type);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(resetModalState, 200);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    setLoading(true);
    try {
      const res = await fetch(API_ROUTES.request, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
        mode: "cors",
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 404) {
        setBanner({ type: "error", msg: "We couldn't find that email. Please register first." });
        setCurrentStep(1);
      } else if (res.ok) {
        setBanner({ type: "success", msg: `OTP sent to ${maskEmail(email)}. Please check your inbox.` });
        setCurrentStep(2);
        setCanResendAt(Date.now() + 60000);
      } else {
        setBanner({ type: "error", msg: data?.error || "Something went wrong." });
      }
    } catch {
      setBanner({ type: "error", msg: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    setLoading(true);
    try {
      const res = await fetch(API_ROUTES.verify, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: userOtp }),
        cache: "no-store",
        mode: "cors",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setBanner({ type: "success", msg: "OTP verified. Please set a new password." });
        setCurrentStep(3);
      } else {
        setBanner({ type: "error", msg: data?.error || "Invalid OTP. Please try again." });
      }
    } catch {
      setBanner({ type: "error", msg: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    setLoading(true);
    setBanner(null);
    try {
      const res = await fetch(API_ROUTES.request, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
        mode: "cors",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setBanner({ type: "success", msg: "A new OTP has been sent to your email." });
        setCanResendAt(Date.now() + 60000);
      } else {
        setBanner({ type: "error", msg: data?.error || "Could not resend OTP." });
      }
    } catch {
      setBanner({ type: "error", msg: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStep === 3 && newPassword && confirmPassword) {
      setPasswordError(newPassword === confirmPassword ? "" : "Passwords do not match.");
    } else {
      setPasswordError("");
    }
  }, [newPassword, confirmPassword, currentStep]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match or are empty.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setBanner(null);
    try {
      const res = await fetch(API_ROUTES.reset, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: userOtp, newPassword }),
        cache: "no-store",
        mode: "cors",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setBanner({ type: "success", msg: "Password updated successfully. You can sign in now." });
        setTimeout(() => {
          handleCloseModal();
        }, 1200);
      } else {
        setBanner({ type: "error", msg: data?.error || "Could not reset password." });
      }
    } catch {
      setBanner({ type: "error", msg: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Sign In"} pages={["Sign In"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row items-stretch gap-8 xl:gap-10">
            <div className="w-full lg:w-1/2">
              <div className="h-full rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
                <div className="text-center mb-11">
                  {user ? (
                    <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                      Welcome, {user.name || user.email}
                    </h2>
                  ) : (
                    <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                      Customer Sign In
                    </h2>
                  )}
                  <p>{user ? "You are logged in" : "Enter your details below to continue"}</p>
                </div>
                {user ? (
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={handleLogout}
                      style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                      className="!bg-[#2563eb] !text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:!bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const res = await fetch(`${BASE_URL}/api/auth/login`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            b2cEmail,
                            b2cPassword,
                            userType: "b2c",
                          }),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          const userData = { name: data.name, userId: data.userId };
                          localStorage.setItem("user", JSON.stringify(userData));
                          setUser(userData);
                          router.push("/");
                        } else {
                          alert(data.error || "Login failed");
                        }
                      } catch {
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
                        id="b2c-email"
                        placeholder="Enter your email"
                        value={b2cEmail}
                        onChange={(e) => setB2cEmail(e.target.value)}
                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        required
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="b2c-password" className="block mb-2.5">
                        Password
                      </label>
                      <input
                        type="password"
                        id="b2c-password"
                        placeholder="Enter your password"
                        value={b2cPassword}
                        onChange={(e) => setB2cPassword(e.target.value)}
                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        required
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
                      Forgot your password?
                    </button>
                    <p className="text-center mt-6">
                      Don&apos;t have an account?
                      <Link href="/signup" className="text-dark ease-out duration-200 hover:text-blue pl-2">
                        Sign Up Now!
                      </Link>
                    </p>
                  </form>
                )}
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
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const res = await fetch(`${BASE_URL}/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          email: b2bEmail,
                          password: b2bPassword,
                          gstNumber: b2bGst,
                          userType: "b2b",
                        }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        const userData = { name: data.name, userId: data.userId };
                        localStorage.setItem("user", JSON.stringify(userData));
                        setUser(userData);
                        router.push("/");
                      } else {
                        alert(data.error || "Login failed");
                      }
                    } catch {
                      alert("Something went wrong");
                    }
                  }}
                >
                  <div className="mb-5">
                    <label htmlFor="b2b-email" className="block mb-2.5 text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      id="b2b-email"
                      placeholder="Enter your business email"
                      value={b2bEmail}
                      onChange={(e) => setB2bEmail(e.target.value)}
                      className="rounded-lg border border-gray-7 bg-gray-2/20 text-white placeholder:text-gray-5 w-full py-3 px-5 outline-none duration-200 focus:border-blue focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="b2b-password" className="block mb-2.5 text-white">
                      Password
                    </label>
                    <input
                      type="password"
                      id="b2b-password"
                      placeholder="Enter your password"
                      autoComplete="on"
                      value={b2bPassword}
                      onChange={(e) => setB2bPassword(e.target.value)}
                      className="rounded-lg border border-gray-7 bg-gray-2/20 text-white placeholder:text-gray-5 w-full py-3 px-5 outline-none duration-200 focus:border-blue focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="b2b-gst" className="block mb-2.5 text-white">
                      Enter GST number
                    </label>
                    <input
                      type="text"
                      id="b2b-gst"
                      placeholder="15-character GSTIN"
                      value={b2bGst}
                      onChange={(e) => setB2bGst(e.target.value.toUpperCase().slice(0, 15))}
                      pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                      title="Enter a valid 15-character GSTIN"
                      className="rounded-lg border border-gray-7 bg-gray-2/20 text-white placeholder:text-gray-5 w-full py-3 px-5 outline-none duration-200 focus:border-blue focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      required
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
                    Forgot your password?
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className={classNames(
              "relative rounded-xl shadow-lg p-8 w-full max-w-md mx-4",
              modalBgColor,
              modalTextColor,
              "z-[10001]"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className={classNames(
                "absolute top-4 right-4 hover:text-red-500",
                modalType === "b2c" ? "text-gray-500" : "text-gray-300"
              )}
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            {banner && (
              <div
                className={classNames(
                  "mb-4 px-4 py-3 rounded-lg text-sm",
                  banner.type === "error" && "bg-red-100 text-red-700",
                  banner.type === "success" && "bg-green-100 text-green-700",
                  banner.type === "info" && "bg-blue-100 text-blue-700"
                )}
              >
                {banner.msg}{" "}
                {banner.msg.includes("register") && (
                  <Link href="/signup" className="underline font-medium ml-1">
                    Register
                  </Link>
                )}
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
                <p className="mb-6">Enter your email address and we&apos;ll send you a one-time password (OTP).</p>
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
                    className={classNames(
                      "rounded-lg border w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20",
                      inputBgColor
                    )}
                  />
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className={classNames(
                      "w-full flex justify-center font-medium text-white py-3 px-6 rounded-lg ease-out duration-200 mt-6",
                      buttonColor,
                      loading && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Enter OTP</h3>
                <p className="mb-4">
                  We sent a 6-digit code to <span className="font-medium">{maskEmail(email)}</span>.
                </p>
                <form onSubmit={handleOtpSubmit}>
                  <label htmlFor="otp" className="block mb-2.5">
                    OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={userOtp}
                    onChange={(e) => setUserOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter the 6-digit code"
                    required
                    maxLength={6}
                    className={classNames(
                      "tracking-widest text-center rounded-lg border w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20",
                      inputBgColor
                    )}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={loading || secondsLeft > 0}
                      className={classNames("text-sm underline", secondsLeft > 0 && "opacity-60 cursor-not-allowed")}
                    >
                      {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend OTP"}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || userOtp.length !== 6}
                    className={classNames(
                      "w-full flex justify-center font-medium text-white py-3 px-6 rounded-lg ease-out duration-200 mt-6",
                      buttonColor,
                      loading && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
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
                      placeholder="At least 6 characters"
                      required
                      className={classNames(
                        "rounded-lg border w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20",
                        inputBgColor
                      )}
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
                      placeholder="Re-enter new password"
                      required
                      className={classNames(
                        "rounded-lg border w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20",
                        inputBgColor
                      )}
                    />
                  </div>
                  {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword ||
                      newPassword.length < 6
                    }
                    className={classNames(
                      "w-full flex justify-center items-center font-medium text-white py-3 px-6 rounded-lg ease-in-out duration-300 mt-6",
                      buttonColor,
                      loading && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {loading ? "Updating..." : "Reset Password"}
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
