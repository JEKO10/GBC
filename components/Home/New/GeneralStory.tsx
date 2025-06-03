// import Image from "next/image";
// import React from "react";

// import General from "@/public/home/general.jpg";

// const GeneralStorySection = () => {
//   return (
//     <article className="flex justify-between items-center px-5 sm:px-28 py-28 bg-[#003745] text-body font-outfit">
//       <div className="relative z-20">
//         <Image
//           src={General}
//           title="General Faridoon Bilimoria - The Inspiration Behind GBC"
//           alt="Lieutenant General Faridoon Bilimoria (center) standing in full ceremonial military uniform, flanked by two high-ranking officers."
//           className="w-[400px]"
//           loading="lazy"
//         />
//       </div>
//       <div className="lg:w-1/2">
//         <h2 className="text-4xl font-semibold mb-8">
//           THE STORY OF GENERAL BILIMORIA
//         </h2>
//         <p className="text-xl leading-relaxed mb-5">
//           GBC is dedicated to
//           <span className="italic">Lieutenant General Bilimoria</span>, a
//           decorated officer in the Indian army.
//         </p>
//         <p className="text-xl leading-relaxed mb-5">
//           Amidst the rigours of military life, he found solace in good food —
//           the kind that brings people together.
//         </p>
//         <p className="text-xl leading-relaxed mb-5">
//           From the bustling markets of India to the distant lands he travelled,
//           Billy developed a deep appreciation for flavours rooted in culture and
//           tradition.
//         </p>
//       </div>
//     </article>
//   );
// };

// export default GeneralStorySection;

import Image from "next/image";
import React from "react";

import General from "@/public/home/general.jpg";

const GeneralStorySection = () => {
  return (
    <article className="flex flex-col lg:flex-row justify-between items-center px-5 sm:px-16 lg:px-28 py-16 bg-[#003745] text-white font-outfit gap-10">
      <div className="relative z-20">
        <Image
          src={General}
          title="General Faridoon Bilimoria - The Inspiration Behind GBC"
          alt="Lieutenant General Faridoon Bilimoria (center) standing in full ceremonial military uniform, flanked by two high-ranking officers."
          className="w-[350px]"
          loading="lazy"
        />
      </div>
      <div className="w-full lg:w-1/2">
        <h2 className="font-arvo text-3xl sm:text-4xl font-semibold mb-6 lg:mb-8">
          THE STORY OF GENERAL BILIMORIA
        </h2>
        <p className="text-lg sm:text-xl leading-relaxed mb-4">
          GBC is dedicated to{" "}
          <span className="italic">Lieutenant General Bilimoria</span>, a
          decorated officer in the Indian army.
        </p>
        <p className="text-lg sm:text-xl leading-relaxed mb-4">
          Amidst the rigours of military life, he found solace in good food —
          the kind that brings people together.
        </p>
        <p className="text-lg sm:text-xl leading-relaxed mb-4">
          From the bustling markets of India to the distant lands he travelled,
          Billy developed a deep appreciation for flavours rooted in culture and
          tradition.
        </p>
      </div>
    </article>
  );
};

export default GeneralStorySection;
