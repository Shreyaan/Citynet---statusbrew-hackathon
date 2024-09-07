import React from "react";
import Image from "next/image";
import EventManagementImage from "../public/event_IMG.png"; // Replace with actual path

const FeatureSection: React.FC = () => {
  return (
    <div className="bg-black">
      <h1 className="text-white text-center text-4xl font-bold">Features</h1>
      <section className=" p-10 lg:flex items-center justify-between bg-black">
        {/* Text Section */}
        <div className="lg:w-1/2 text-left pr-10">
          <h3 className="text-xl text-white font-semibold mb-4">VISION</h3>
          <h2 className="text-3xl md:text-4xl text-white font-bold mb-4">
            We’re Changing the Way the World Thinks About Event Management
          </h2>
          <p className="text-gray-400 mb-6">
            Our AI-powered event management tool allows for seamless planning,
            scheduling, and real-time event tracking. It’s designed to reduce
            complexity, automate tasks, and give you full control over every
            aspect of your events. From handling registrations to analytics, our
            system is built to streamline every part of event management.
          </p>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2">
          <Image
            src={EventManagementImage}
            alt="Event Management"
            width={500} // Adjust based on your image size
            height={300} // Adjust based on your image size
            layout="responsive"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default FeatureSection;
