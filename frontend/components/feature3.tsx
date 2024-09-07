import React from "react";
import Image from "next/image";
import EventManagementImage from "../public/1.png";

const FeatureThree: React.FC = () => {
  return (
    <div className="bg-black pt-20">
      <section className="pl-20 pr-20 lg:flex items-center justify-between bg-black">
        {/* Text Section */}
        <div className="lg:w-1/2 text-left pr-10">
          <div className="border-l-4 border-gray-500 pl-6">
            <h1 className="text-xl text-white font-semibold mb-4">
              Efficient Garbage Collection Notifications
            </h1>
            <h2 className="text-3xl md:text-4xl text-white font-bold mb-4">
              Streamlining Waste Management with Real-Time Alerts
            </h2>
            <p className="text-gray-400 mb-6">
              Description: Our Garbage Notification System simplifies waste
              management by allowing users to report overflowing garbage bins or
              missed pickups. When a report is submitted, the system sends an
              immediate alert to the municipal waste management team, ensuring
              that garbage is collected promptly and efficiently. This feature
              helps maintain cleanliness in the city, reduces littering, and
              promotes a healthier environment for all residents.
            </p>
            <button className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-800 transition">
              Learn More
            </button>
          </div>
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

export default FeatureThree;
