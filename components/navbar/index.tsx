"use client";

import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
// import Search from "@components/Navbar/components/Search";

import NavigationMenuDemo from "@components/shadcn-components/NavigationMenuDemo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@hooks/useAuth";
import Cart from "./components/Cart";
import Bunner from "./components/Bunner";
//import { SearchDrawer } from "../shadcn";
import { getCategories } from "@lib/utils";

const Navbar = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const [category, setCategory] = useState<string[]>([]);
  const pathname = usePathname();
  useEffect(() => {
    getCategories().then(setCategory);
    setOpenMenu(false);
  }, [pathname]);

  return (
    <>
      <header className=" fixed w-full  top-0 left-0 z-50 bg-white   ">
        <Bunner />
        <div className=" px-4 lg:px-20 lg:py-2 border-b  relative ">
          <div className="flex h-16 items-center justify-between space-x-10   ">
            {/* mible menu */}

            <div className="flex lg:items-center lg:gap-12   ">
              <div className=" lg:hidden">
                <button
                  onClick={() => setOpenMenu((prev) => !prev)}
                  className=" p-2 text-gray-600 transition mr-2 hover:text-gray-600/75"
                  aria-label="Toggle menu"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.375 12C21.375 12.2984 21.2565 12.5845 21.0455 12.7955C20.8345 13.0065 20.5484 13.125 20.25 13.125H3.75C3.45163 13.125 3.16548 13.0065 2.9545 12.7955C2.74353 12.5845 2.625 12.2984 2.625 12C2.625 11.7016 2.74353 11.4155 2.9545 11.2045C3.16548 10.9935 3.45163 10.875 3.75 10.875H20.25C20.5484 10.875 20.8345 10.9935 21.0455 11.2045C21.2565 11.4155 21.375 11.7016 21.375 12ZM3.75 7.125H20.25C20.5484 7.125 20.8345 7.00647 21.0455 6.7955C21.2565 6.58452 21.375 6.29837 21.375 6C21.375 5.70163 21.2565 5.41548 21.0455 5.2045C20.8345 4.99353 20.5484 4.875 20.25 4.875H3.75C3.45163 4.875 3.16548 4.99353 2.9545 5.2045C2.74353 5.41548 2.625 5.70163 2.625 6C2.625 6.29837 2.74353 6.58452 2.9545 6.7955C3.16548 7.00647 3.45163 7.125 3.75 7.125ZM20.25 16.875H3.75C3.45163 16.875 3.16548 16.9935 2.9545 17.2045C2.74353 17.4155 2.625 17.7016 2.625 18C2.625 18.2984 2.74353 18.5845 2.9545 18.7955C3.16548 19.0065 3.45163 19.125 3.75 19.125H20.25C20.5484 19.125 20.8345 19.0065 21.0455 18.7955C21.2565 18.5845 21.375 18.2984 21.375 18C21.375 17.7016 21.2565 17.4155 21.0455 17.2045C20.8345 16.9935 20.5484 16.875 20.25 16.875Z"
                      fill="black"
                    />
                    NEW ARRIVALS
                  </svg>
                </button>
              </div>
              <Link
                href={"/"}
                className=" hidden md:block font-integral text-primary-600 font-extrabold text-3xl"
              >
                SHOP.CO
              </Link>
            </div>
            <AnimatePresence>
              {openMenu && (
                <motion.div
                  initial={{ y: "-15vh", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-15vh", opacity: 0 }}
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.3,
                  }}
                  className="absolute bg-primary  text-secondary top-16  inset-x-0  px-11 w-full z-10 lg:hidden"
                >
                  <ul className="flex flex-col  py-3 gap-6 text-lg">
                    {isAdmin && (
                      <li>
                        <Link
                          className="  hover:text-gray-800 "
                          href={"/admin"}
                        >
                          Admin Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <NavigationMenuDemo categories={category} />
                    </li>

                    <li>
                      <Link
                        className="  hover:text-gray-800 "
                        href={"/shop/?sortBy=rating&order=desc"}
                      >
                        On Sale
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="  hover:text-gray-800 "
                        href={"/shop/?sortBy=meta&order=desc"}
                      >
                        New Arrivals
                      </Link>
                    </li>

                    {/* <li>
                      <a className="hover:text-gray-800" href="#brands">
                        Brands
                      </a>
                    </li> */}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            {/* desktop menu */}
            <div className=" w-full hidden lg:block">
              <div className="flex items-center ">
                <div className="mr-6 ">
                  <nav aria-label="Global">
                    <ul className="flex items-center   py-3 gap-6 text-sm">
                      {isAdmin && (
                        <li>
                          <Link
                            className="  hover:text-gray-800 "
                            href={"/admin"}
                          >
                            Admin Dashboard
                          </Link>
                        </li>
                      )}
                      <li>
                        <NavigationMenuDemo categories={category} />
                      </li>

                      <li>
                        <Link
                          className="  hover:text-gray-800 "
                          href={"/shop/?sortBy=rating&order=desc"}
                        >
                          On Sale
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="  hover:text-gray-800 "
                          href={"/shop/?sortBy=meta&order=desc"}
                        >
                          New Arrivals
                        </Link>
                      </li>

                      {/* <li>
                        <a className="hover:text-gray-800" href="#brands">
                          Brands
                        </a>
                      </li> */}
                    </ul>
                  </nav>
                </div>

                {/* <Search /> */}
              </div>
            </div>

            <div className="flex items-center    gap-4">
              <div className=" lg:hidden   ">
                {/* <SearchDrawer /> */}
              </div>
              <div className=" flex items-center gap-4">
                <Cart />

                {isAuthenticated ? (
                  <>
                    <Link href={"/profile"}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 1.875C9.99747 1.875 8.0399 2.46882 6.37486 3.58137C4.70981 4.69392 3.41206 6.27523 2.64572 8.12533C1.87939 9.97543 1.67888 12.0112 2.06955 13.9753C2.46023 15.9393 3.42454 17.7435 4.84055 19.1595C6.25656 20.5755 8.06066 21.5398 10.0247 21.9305C11.9888 22.3211 14.0246 22.1206 15.8747 21.3543C17.7248 20.5879 19.3061 19.2902 20.4186 17.6251C21.5312 15.9601 22.125 14.0025 22.125 12C22.122 9.3156 21.0543 6.74199 19.1562 4.84383C17.258 2.94567 14.6844 1.87798 12 1.875ZM7.45969 18.4284C7.98195 17.7143 8.66528 17.1335 9.45418 16.7331C10.2431 16.3327 11.1153 16.124 12 16.124C12.8847 16.124 13.7569 16.3327 14.5458 16.7331C15.3347 17.1335 16.0181 17.7143 16.5403 18.4284C15.2134 19.3695 13.6268 19.875 12 19.875C10.3732 19.875 8.78665 19.3695 7.45969 18.4284ZM9.375 11.25C9.375 10.7308 9.52896 10.2233 9.8174 9.79163C10.1058 9.35995 10.5158 9.0235 10.9955 8.82482C11.4751 8.62614 12.0029 8.57415 12.5121 8.67544C13.0213 8.77672 13.489 9.02673 13.8562 9.39384C14.2233 9.76096 14.4733 10.2287 14.5746 10.7379C14.6759 11.2471 14.6239 11.7749 14.4252 12.2545C14.2265 12.7342 13.8901 13.1442 13.4584 13.4326C13.0267 13.721 12.5192 13.875 12 13.875C11.3038 13.875 10.6361 13.5984 10.1438 13.1062C9.65157 12.6139 9.375 11.9462 9.375 11.25ZM18.1875 16.8694C17.4583 15.9419 16.5289 15.1914 15.4688 14.6737C16.1444 13.9896 16.6026 13.1208 16.7858 12.1769C16.9689 11.2329 16.8688 10.2558 16.498 9.36861C16.1273 8.4814 15.5024 7.72364 14.702 7.19068C13.9017 6.65771 12.9616 6.37334 12 6.37334C11.0384 6.37334 10.0983 6.65771 9.29797 7.19068C8.49762 7.72364 7.87275 8.4814 7.50198 9.36861C7.13121 10.2558 7.0311 11.2329 7.21424 12.1769C7.39739 13.1208 7.85561 13.9896 8.53125 14.6737C7.4711 15.1914 6.54168 15.9419 5.8125 16.8694C4.89661 15.7083 4.32614 14.3129 4.1664 12.8427C4.00665 11.3725 4.2641 9.88711 4.90925 8.55644C5.55441 7.22578 6.5612 6.10366 7.81439 5.31855C9.06757 4.53343 10.5165 4.11703 11.9953 4.11703C13.4741 4.11703 14.9231 4.53343 16.1762 5.31855C17.4294 6.10366 18.4362 7.22578 19.0814 8.55644C19.7265 9.88711 19.984 11.3725 19.8242 12.8427C19.6645 14.3129 19.094 15.7083 18.1781 16.8694H18.1875Z"
                          fill="black"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={logout}
                      className="ml-2 px-3 py-2 text-nowrap rounded bg-gray-200 hover:bg-gray-300 text-sm "
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signup"
                      className="rounded-full py-2 px-3  text-nowrap  border  bg-primary text-secondary hover:bg-white hover:text-primary transition-all duration-150"
                    >
                      Sign up
                    </Link>
                    <Link
                      href="/auth/signin"
                      className=" rounded-full py-2 px-3  text-nowrap  border hover:bg-primary hover:text-white transition-all duration-150"
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
