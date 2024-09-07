// Import the necessary component from the Aceternity UI package
import { BackgroundGradient } from 'aceternity-ui'; // Replace 'aceternity-ui' with the actual package name if different

const Home = () => {
  return (
    <div>
      {/* Use the BackgroundGradient component */}
      <BackgroundGradient>
        <div className="relative z-10 p-10">
          <h1 className="text-white text-4xl font-bold">Welcome to My Project</h1>
          <p className="text-gray-300">Here is a sample of text inside the gradient background.</p>
        </div>
  
    </div>
  );
};

export default Home;
