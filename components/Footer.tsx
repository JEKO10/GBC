// import Image from "next/image";
// import Link from "next/link";
// import React from "react";

// import { currentUser } from "@/lib/auth";
// import Logo from "@/public/logo.png";

// const Footer = async () => {
//   const user = await currentUser();

//   return (
//     <footer className="font-outfit bg-primary text-white py-10 md:py-0 px-10">
//       <ul className="flex justify-between items-center flex-col md:flex-row">
//         <li className="text-center text-lg">
//           <p>Phone: 07760423037</p>
//           <p>
//             <a
//               href="mailto:hello@gbcanteen.com"
//               className="underline hover:text-secondary transition"
//             >
//               hello@gbcanteen.com
//             </a>
//           </p>
//         </li>
//         <li className="my-5">
//           <Link href="/">
//             <Image
//               className="w-[200px] lg:w-[150px] xl:w-[170px] cursor-pointer"
//               src={Logo}
//               alt="Logo for General Bilimoria's Canteen, featuring a vintage-style design with text reading 'GENERAL' curved at the top, 'BILIMORIA'S CANTEEN' in bold capital letters, and 'ESTD. 2023, LONDON, UK' at the bottom."
//               priority
//             />
//           </Link>
//         </li>
//         {user ? (
//           <li className="hidden md:block cursor-pointer ml-9 xl:ml-20 2xl:ml-28 md:text-lg transition hover:text-secondary">
//             <Link href="/profile">{user.name}</Link>
//           </li>
//         ) : (
//           <li className="cursor-pointer bg-secondary font-semibold ml-9 xl:ml-20 2xl:ml-28 px-5 py-1 rounded-none rounded-r-2xl transition hover:text-primary hover:bg-body">
//             <Link href="/auth/register">Sign up</Link>
//           </li>
//         )}
//       </ul>
//     </footer>
//   );
// };

// export default Footer;

import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-5 md:py-10 px-5 font-outfit">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between px-16 gap-5 md:gap-10 text-center">
        <h2 className="text-4xl font-bold">G.B.C.</h2>
        <ul className="flex flex-col sm:flex-row gap-2 sm:gap-10 text-lg">
          <li>
            <Link href="/about" className="hover:underline">
              About us
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:underline">
              Contact us
            </Link>
          </li>
          <li>
            <Link href="/map" className="hover:underline">
              Where to find us
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
