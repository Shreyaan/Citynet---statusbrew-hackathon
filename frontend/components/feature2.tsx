import React from "react";
import Image from "next/image";
import EmergencyImage from "@/public/2.png"; // Ensure this path is correct

const FeatureTwo: React.FC = () => {
  return (
    <section className="bg-black pr-20 pl-10 lg:flex items-center justify-between text-white">
      {/* Image Section */}
      <div className="lg:w-1/2 relative h-[700px] pr-20"> {/* Adjust height as needed */}
        <Image
          src={EmergencyImage}
          alt="Emergency Report Feature"
          fill
          style={{ objectFit: "cover" }}
          className=""
        />
      </div>

      {/* Text Section */}
      <div className="lg:w-1/2 text-left pl-6 border-r-4 border-gray-500">
        <h3 className="text-xl font-semibold mb-4">SERVICES</h3>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Emergency Reporting with AI Notifications
        </h2>
        <p className="text-white-600 mb-6">
          Our emergency report system allows users to quickly report emergencies
          such as fires, medical incidents, or crimes. In the case of a fire
          outbreak, our AI-driven system will instantly notify the relevant
          authorities, ensuring fast response and increased safety across the
          city.
        </p>
        <button className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-800 transition">
          Learn More
        </button>
      </div>
    </section>
  );
};

export default FeatureTwo;
