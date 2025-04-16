import React from "react";

const Hero = () => {
  return (
    <header
      className="min-h-[85vh] lg:min-h-[81.8vh] bg-center bg-cover bg-no-repeat flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/contact/office.png')`,
      }}
    >
      <article className="w-[90%] md:w-full font-outfit max-w-lg text-center bg-primary/80 -mt-24 py-10 px-5 sm:px-14 rounded-md">
        <p className="text-lg sm:text-xl mb-2">We’d love to hear from you!</p>
        <p className="text-lg sm:text-xl mb-8">
          We aim to reply as quickly as possible.
        </p>
        <ul className="text-center w-full space-y-2 text-sm sm:text-base max-w-lg list-none">
          <li>
            <a
              href="mailto:hello@gbcanteen.com"
              className="text-lg underline hover:text-secondary transition"
            >
              hello@gbcanteen.com
            </a>
          </li>
          <li>
            <a
              href="mailto:vimal@gbcanteen.com"
              className="text-lg underline hover:text-secondary transition"
            >
              vimal@gbcanteen.com
            </a>
          </li>
          <li>
            <a
              href="mailto:branko@gbcanteen.com"
              className="text-lg underline hover:text-secondary transition"
            >
              branko@gbcanteen.com
            </a>
          </li>
        </ul>
      </article>
    </header>
  );
};

export default Hero;
