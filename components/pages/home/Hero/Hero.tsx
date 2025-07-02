"use client";
import { useRouter } from "next/navigation";
import Brands from "./Brands";

import Circle from "./Circle";

const data = [
  {
    numbers: 200,
    title: "International Brands",
  },
  {
    numbers: 2000,
    title: "High-Quality Products",
  },
  {
    numbers: 30000,
    title: "Happy Customers",
  },
];
const Hero = () => {
  const router = useRouter();
  return (
    <>
      <section className=" py-10 md:py-20 bg-secondary-foreground px-4 md:px-20">
        <div className="container lg:flex justify-between">
          <div className="  lg:w-1/2 ">
            <div className="space-y-8 mb-12">
              <h1 className=" text-5xl md:text-6xl font-extrabold font-integral">
                FIND CLOTHES
                <br /> THAT MATCHES <br />
                YOUR STYLE
              </h1>
              <p className=" text-base   text-gray-500 ">
                Browse through our diverse range of meticulously crafted
                garments, designed to bring out your individuality and cater to
                your sense of style.
              </p>
              <button
                className=" text-white w-full md:w-auto  py-4 px-16 
                 rounded-full bg-primary"
                onClick={() => router.push("shop/?sortBy=meta&order=desc")}
              >
                Shop Now
              </button>
            </div>

            <div className="flex  flex-wrap md:flex-nowrap justify-center     md:px-0">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="even:border-l-2  sm:even:border-r-2 border-gray-300 px-6 mt-4 md:mt-0"
                >
                  <h4 className="text-2xl md:text-4xl font-bold">
                    {item.numbers.toLocaleString("en-US")}+
                  </h4>
                  <p className="text-sm md:text-base text-gray-500  ">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 lg:mt-0  ">
            <Circle />
          </div>
        </div>
      </section>
      <Brands />
    </>
  );
};

export default Hero;
