import React from "react";

const Banner = () => {
  const bgImage = "/images/ecommerce/banner.jpg";

  return (
    <div
      className="w-full min-h-[400px] md:min-h-[400px] bg-no-repeat bg-center bg-cover flex items-center justify-center relative"
      style={{ backgroundImage: `url(${bgImage})`, marginTop: "200px" }}
    >
      {/* Optional Gradient Overlay — can comment out if not needed */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/10 backdrop-blur-sm" /> */}

      {/* Centered Content */}
      
      <div className="relative z-10 text-center px-4 bg-white/70 p-6 rounded-md shadow-lg mt-35">
        <h1 className="text-2xl md:text-5xl font-extrabold text-gray-900 drop-shadow-lg">
          Mahaveer Paper Enterprises
        </h1>
        <p className="mt-4 text-md md:text-xl text-gray-700 font-medium">
          Every Stationery Brand You Love, <br /> At One Place.
        </p>
      </div>
    </div>
  );
};

export default Banner;
