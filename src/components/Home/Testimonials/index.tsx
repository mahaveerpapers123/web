"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import testimonialsData from "./testimonialsData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";
import { createPortal } from "react-dom";

type Props = {
  productId?: string;
};

type StoredUser = {
  name?: string;
  username?: string;
  fullName?: string;
  userId?: string;
  email?: string;
};

const API_BASE =
  (typeof window !== "undefined" && (process.env.NEXT_PUBLIC_API_BASE_URL || "")) ||
  "https://mahaveerpapersbe.vercel.app";

const uuidRE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getSession = (): { loggedIn: boolean; name: string | null; email: string | null } => {
  try {
    const grab = (k: string | null) => (k && k !== "null" && k.trim() ? k.trim() : null);
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const u: StoredUser = JSON.parse(rawUser);
      const name = grab(u?.name || "") || grab(u?.username || "") || grab(u?.fullName || "");
      const email = grab(u?.email || "");
      const loggedIn = !!(u?.userId || name || email);
      if (loggedIn) return { loggedIn, name, email };
    }
    const rawAuth = localStorage.getItem("authUser");
    if (rawAuth) {
      const au: StoredUser = JSON.parse(rawAuth);
      const name = grab(au?.name || "") || grab(au?.fullName || "") || grab(au?.username || "");
      const email = grab(au?.email || "");
      const loggedIn = !!(name || email);
      if (loggedIn) return { loggedIn, name, email };
    }
    const name = grab(localStorage.getItem("userName")) || grab(localStorage.getItem("b2cName"));
    const email =
      grab(localStorage.getItem("userEmail")) ||
      grab(localStorage.getItem("b2cEmail")) ||
      grab(localStorage.getItem("email"));
    return { loggedIn: !!(name || email), name, email };
  } catch {
    return { loggedIn: false, name: null, email: null };
  }
};

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const el = useMemo(() => {
    if (typeof document === "undefined") return null as any;
    const d = document.createElement("div");
    d.id = "review-portal";
    return d;
  }, []);
  useEffect(() => {
    if (!el || typeof document === "undefined") return;
    document.body.appendChild(el);
    setMounted(true);
    return () => {
      document.body.removeChild(el);
    };
  }, [el]);
  if (!mounted || !el) return null;
  return createPortal(children, el);
};

const Testimonials = ({ productId }: Props) => {
  const sliderRef = useRef<any>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [stickyVisible, setStickyVisible] = useState(true);

  const validProductId = useMemo(
    () => (productId && uuidRE.test(productId) ? productId : null),
    [productId]
  );

  useEffect(() => {
    const s = getSession();
    setEmail(s.email);
    setName(s.name);
    const onStorage = () => {
      const s2 = getSession();
      setEmail(s2.email);
      setName(s2.name);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleOpenReview();
      }
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [email, name]);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  const handleOpenReview = () => {
    const s = getSession();
    if (!s.loggedIn) {
      router.push("/signin");
      return;
    }
    setEmail(s.email);
    setName(s.name);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setRating(0);
    setHover(0);
    setTitle("");
    setFeedback("");
    setImages([]);
  };

  const handleSubmit = async () => {
    const s = getSession();
    if (!s.loggedIn || rating === 0 || feedback.trim() === "" || !validProductId) return;
    setSubmitting(true);
    const payload = {
      product_id: validProductId,
      user_name: (name || s.name || s.email?.split("@")[0]) || "user",
      user_email: email || s.email || null,
      rating,
      title: title.trim() || null,
      body: feedback.trim(),
      images: images.length ? images : null,
    };
    try {
      await fetch(`${API_BASE.replace(/\/$/, "")}/api/reviews`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
        keepalive: true,
      });
    } finally {
      setSubmitting(false);
      handleClose();
    }
  };

  return (
    <>
      <Portal>
        <div className="fixed top-0 left-0 right-0 z-[9998]">
          {stickyVisible && (
            <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
              <div className="mt-2 flex items-center justify-between rounded-xl bg-dark text-white px-4 py-2 shadow-lg">
                <p className="text-xs sm:text-sm">Have thoughts about this product?</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenReview}
                    className="px-3 py-1.5 rounded-lg bg-white text-dark text-xs sm:text-sm font-medium hover:opacity-90"
                  >
                    Write a review
                  </button>
                  <button
                    onClick={() => setStickyVisible(false)}
                    className="px-2 py-1 rounded-lg text-white/70 hover:text-white"
                    aria-label="Hide review bar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
              <h3 className="text-base sm:text-lg font-semibold text-dark mb-1 pr-8">Share your review</h3>
              {!validProductId && (
                <p className="mb-3 text-xs text-red-500">
                  This page isn’t tied to a product. Open a product page to submit a review.
                </p>
              )}
              <div className="mb-4 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = hover >= star || rating >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      className="p-1 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
                        <path
                          d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.786 1.402 8.166L12 18.896l-7.336 3.867 1.402-8.166L.132 9.211l8.2-1.193z"
                          fill={filled ? "#FFD700" : "#D1D5DB"}
                        />
                      </svg>
                    </button>
                  );
                })}
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="w-full rounded-xl border border-gray-200 p-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-dark/10 mb-3"
              />
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback..."
                className="w-full h-28 rounded-xl border border-gray-200 p-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-dark/10"
              />
              <input
                type="text"
                value={images.join(",")}
                onChange={(e) =>
                  setImages(
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="Image URLs, comma separated (optional)"
                className="w-full rounded-xl border border-gray-200 p-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-dark/10 mt-3"
              />
              <div className="grid grid-cols-2 gap-2 mt-3">
                <input
                  value={name || ""}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-dark/10"
                />
                <input
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-dark/10"
                />
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-dark text-xs sm:text-sm font-medium hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0 || feedback.trim() === "" || submitting || !validProductId}
                  className="px-4 py-2 rounded-xl bg-dark text-white text-xs sm:text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Portal>

      <section className="overflow-hidden pb-16.5 mt-12 sm:mt-16">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="">
            <div className="swiper testimonial-carousel common-carousel p-5">
              <div className="mb-6 sm:mb-10 flex items-center justify-between">
                <div>
                  <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5 text-xs sm:text-sm">
                    <Image src="/images/icons/icon-08.svg" alt="icon" width={17} height={17} />
                    Best Reviews
                  </span>
                  <h2 className="font-semibold text-lg sm:text-xl xl:text-heading-5 text-dark">User Feedbacks</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleOpenReview}
                    className="px-4 py-2 rounded-xl bg-dark text-white text-xs sm:text-sm font-medium hover:opacity-90"
                  >
                    Write a review
                  </button>
                  <div onClick={handlePrev} className="swiper-button-prev">
                    <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z"
                      />
                    </svg>
                  </div>
                  <div onClick={handleNext} className="swiper-button-next">
                    <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <Swiper
                ref={sliderRef}
                slidesPerView={3}
                spaceBetween={20}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  1000: { slidesPerView: 2 },
                  1200: { slidesPerView: 3 },
                }}
              >
                {testimonialsData.map((item, key) => (
                  <SwiperSlide key={key}>
                    <SingleItem testimonial={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
