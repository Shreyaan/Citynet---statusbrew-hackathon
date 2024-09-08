import React from "react";
import Image from "next/image";

const FeatureFour: React.FC = () => {
  return (
    <section className="bg-black pr-20 pl-10 lg:flex items-center justify-between text-white">
      {/* Image Section */}
      <div className="lg:w-1/2 relative h-[500px] pr-20">
        {" "}
        {/* Adjust height as needed */}
        <Image
          src="/3.png"
          alt="Emergency Report Feature"
          fill
          style={{ objectFit: "cover" }}
          className=""
        />
      </div>

      {/* Text Section */}
      <div className="lg:w-1/2 text-left pl-6 border-r-4 border-gray-500">
        <h3 className="text-xl font-semibold mb-4">
          Smart Electricity Bill Notifications
        </h3>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay on Top of Your Utility Expenses with Automated Alerts
        </h2>
        <p className="text-white-600 mb-6">
          With our Electricity Bill Alerts feature, users receive timely
          notifications about their electricity usage and upcoming bills. This
          system helps prevent unexpected charges by providing alerts about high
          consumption patterns or billing anomalies. Additionally, users can
          track their energy usage over time, allowing them to make informed
          decisions to reduce consumption and save on electricity costs.
        </p>
        <button className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-800 transition">
          Learn More
        </button>
      </div>
    </section>
  );
};

export default FeatureFour;
