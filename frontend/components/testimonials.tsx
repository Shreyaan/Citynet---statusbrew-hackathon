// Testimonials.tsx
import React from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    image: "/p1.jpg",
    text: "This AI tool has revolutionized our workflow. It's intuitive, powerful, and has saved us countless hours on data analysis.",
  },
  {
    name: "Michael Chen",
    image: "/p2.jpg",
    text: "I'm impressed by the accuracy and speed of this AI solution. It's become an indispensable part of our decision-making process.",
  },
  {
    name: "Emily Rodriguez",
    image: "/p3.jpg",
    text: "The customer support is exceptional. They've been incredibly responsive and helpful in tailoring the AI to our specific needs.",
  },
  {
    name: "David Patel",
    image: "/p4.jpg",
    text: "The customer support is exceptional. They've been incredibly responsive and helpful in tailoring the AI to our specific needs.",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-black py-16 overflow-hidden">
      <h2 className="text-white text-center text-4xl font-bold mb-10">
        What People Say About Us
      </h2>
      <div className="relative w-full overflow-hidden">
        {/* Duplicating the testimonial row to create infinite scroll */}
        <div className="flex animate-marquee space-x-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="min-w-[300px] bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="mb-4">{testimonial.text}</p>
              <h4 className="font-semibold">{testimonial.name}</h4>
            </div>
          ))}

          {/* Duplicate the testimonials to ensure seamless looping */}
          {testimonials.map((testimonial, index) => (
            <div
              key={index + testimonials.length} // Avoid key conflicts
              className="min-w-[300px] bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="mb-4">{testimonial.text}</p>
              <h4 className="font-semibold">{testimonial.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
