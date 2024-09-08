import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8  mt-20 h-screen text-center">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <p className="mb-4">
          Welcome to our website! We are a passionate team dedicated to
          providing high-quality services and products to our customers.
        </p>
        <p className="mb-4">
          Our mission is to [Your mission statement here]. We strive to [Your
          goals or values here].
        </p>
        <p>
          Founded in [year], we have been serving our community for [number]
          years, constantly improving and expanding our offerings to meet the
          evolving needs of our clients.
        </p>
      </main>
      <Footer />
    </div>
  );
}
