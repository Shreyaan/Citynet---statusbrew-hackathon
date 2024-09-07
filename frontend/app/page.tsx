// app/home/page.tsx
// import Navbar from '../components/navbar'; // Import Navbar component from the components folder
// import Image from 'next/image';
// import cityImage from '
// '; // Ensure your image is placed in the public folder

import DashboardNavbar from "@/components/ui/dashnav";

export default function Home() {
  return (
    // <div className="relative h-screen">
    //   <Navbar />
    //   <div className="absolute inset-0">
    //     {/* <Image 
    //       src={cityImage} 
    //       alt="City Background"
    //       layout="fill"
    //       objectFit="cover"
    //     /> */}
    //     {/* Black Fade Effect */}
    //     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
    //   </div>
    //   <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
    //     <h1 className="text-6xl font-extrabold mb-6">Empowering Communities</h1>
    //     <h2 className="text-4xl mb-6">Enhancing Cities</h2>
    //     <p className="text-lg mb-8">AI-Powered Solutions for Urban Management and Community Engagement.</p>
    //     <button className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-300 transition">
    //       Discover more
    //     </button>
    //   </div>
    // </div>
    <DashboardNavbar />
  );
}
