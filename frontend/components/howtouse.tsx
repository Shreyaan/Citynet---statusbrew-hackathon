// HowToUse.tsx
import React from "react";
import Image from "next/image";

const HowToUse: React.FC = () => {
  return (
    <section className="bg-black py-16 text-white">
      <h2 className="text-4xl text-center font-bold mb-10">How to Use</h2>
      <div className="flex flex-col lg:flex-row items-center justify-between px-10 lg:px-20">
        {/* Text Section */}
        <div className="lg:w-1/2 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-full"></div>
            <div>
              <h3 className="text-xl font-semibold">Create an Account</h3>
              <p className="text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-400 rounded-full"></div>
            <div>
              <h3 className="text-xl font-semibold">Join Events</h3>
              <p className="text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-400 rounded-full"></div>
            <div>
              <h3 className="text-xl font-semibold">Book Smart</h3>
              <p className="text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 mt-10 lg:mt-0">
          <Image
            src="/how.png"
            alt="How to Use"
            width={500}
            height={300}
            layout="responsive"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
