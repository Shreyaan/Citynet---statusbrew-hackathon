// Testimonials.tsx
import React from 'react';

const testimonials = [
  {
    name: "John Doe",
    image: "/path-to-image1.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "Jane Smith",
    image: "/path-to-image2.jpg",
    text: "Pellentesque ac justo nec libero ultrices sollicitudin a a enim.",
  },
  {
    name: "Alice Johnson",
    image: "/path-to-image3.jpg",
    text: "Cras nec purus nec neque sodales aliquet in at erat.",
  },
  {
    name: "Leo Stanlee",
    image: "/path-to-image4.jpg",
    text: "Vestibulum ante ipsum primis in faucibus orci luctus et.",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-black py-16 overflow-hidden">
      <h2 className="text-white text-center text-4xl font-bold mb-10">What People Say About Us</h2>
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
              key={index + testimonials.length}  // Avoid key conflicts
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
