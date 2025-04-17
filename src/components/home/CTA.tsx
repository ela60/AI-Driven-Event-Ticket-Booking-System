import { FaArrowRight } from "react-icons/fa";

const CTA = () => { 
  return (
    <div className="pb-12">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-700 dark:text-neutral-200 mb-3">
          Join Us & Experience the Best Events!
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
          Sign up today and start exploring events tailored just for you.
        </p>
      </div>
      <section 
  className="relative container md:max-w-7xl mx-auto py-16 px-8 text-white flex flex-col items-center text-center rounded-lg shadow-lg bg-cover bg-center"
  style={{ backgroundImage: "url('https://i.imgur.com/DnJVTS3.png')" }}
>
  {/* Light Dark Overlay */}
  <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>

  {/* Content */}
  <div className="relative z-10">
    <h2 className="text-3xl md:text-4xl font-semibold mb-6">
      Ready to take the next step?
    </h2>

    <p className="text-lg md:text-xl max-w-xl mb-8">
      Join thousands of others and make the most of what we offer. Sign up
      today and start your journey towards success!
    </p>

    <button className="bg-primary-700 border mx-auto text-white py-3 px-6 rounded-full text-lg md:text-xl transition-transform transform hover:scale-105 flex items-center space-x-3">
      <span className="cursor-pointer text-center">Get Started</span>
      <FaArrowRight className="text-xl" />
    </button>
  </div>
</section>

    </div>
  );
};

export default CTA;
