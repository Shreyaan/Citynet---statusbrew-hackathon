// Home.tsx
import React from "react";
import Navbar from "@/components/navbar";
import FeatureSection from "@/components/feature";
import FeatureTwo from "@/components/feature2";
import FeatureThree from "@/components/feature3";
import FeatureFour from "@/components/feature4";
import HowToUse from "@/components/howtouse";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
const Home: React.FC = () => {
  return (
    <div>
      <div className="relative h-screen w-full bg-black text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/bg_website[1].png')`,
          }}
        >
          {/* Fade from black at the top and bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black h-full w-full"></div>
        </div>
        {/* Navbar Component */}
        <Navbar /> {/* Navbar imported here */}
        {/* Main Heading */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Empowering Communities <br /> Enhancing Cities
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            AI-Powered Solutions for Urban Management and Community Engagement.
          </p>

          {/* Discover Button */}
          <button className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">            Discover more
          </button>
        </div>
        <div className="bg-black text-white">
          <h1>Hello World</h1>
        </div>
      </div>
      <div id="features">
        <FeatureSection />
        <FeatureTwo />
        <FeatureThree />
        <FeatureFour />
      </div>
      <HowToUse />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
