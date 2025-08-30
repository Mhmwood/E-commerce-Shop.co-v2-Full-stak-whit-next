"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const BrowseByDress = () => {
  const router = useRouter();

  return (
    <section className=" py-10 md:py-20  px-4 md:px-20">
      <div className="p-16 bg-secondary-foreground rounded-3xl text-center ">
        <h2 className="text-4xl font-extrabold mb-16 font-integral">
          BROWSE BY DRESS STYLE
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5  ">
          <div
            onClick={() => router.push("/shop?category=clothing")}
            className="cursor-pointer relative overflow-hidden rounded-3xl md:col-span-1  h-[190px] md:h-[289px]"
          >
            <h4 className="absolute z-10 font-bold text-5xl top-0 left-0 transform translate-y-6 translate-x-9">
              shirts
            </h4>
            <div className="w-full z-0  h-full  ">
              <Image
                src="/images/website/Browse By Dress/casual.png"
                className="transform  transition-transform duration-300 hover:scale-105 object-cover w-full h-full"
                alt="casual"
                fill
              />
            </div>
          </div>

          <div
            onClick={() => router.push("/shop?category=clothing")}
            className="cursor-pointer relative overflow-hidden rounded-3xl md:col-span-2 h-[190px] md:h-[289px] "
          >
            <h4 className="absolute z-10 font-bold text-5xl top-0 left-0 transform translate-y-6 translate-x-9">
              watches
            </h4>
            <div className="w-full z-0  h-full ">
              <Image
                src="/images/website/Browse By Dress/formal.png"
                className="transform  transition-transform duration-300 hover:scale-105 object-cover w-full h-full"
                alt="formal"
                fill
              />
            </div>
          </div>

          <div
            onClick={() => router.push("/shop?category=clothing")}
            className="cursor-pointer relative overflow-hidden rounded-3xl md:col-span-2 h-[190px] md:h-[289px]"
          >
            <h4 className="absolute z-10 font-bold text-5xl top-0 left-0 transform translate-y-6 translate-x-9">
              Party
            </h4>
            <div className="w-full z-0  h-full ">
              <Image
                src="/images/website/Browse By Dress/party.png"
                className="transform  transition-transform duration-300 hover:scale-105 object-cover w-full h-full"
                alt="party"
                fill
              />
            </div>
          </div>

          <div
            onClick={() => router.push("/shop?category=Sports")}
            className="cursor-pointer relative overflow-hidden rounded-3xl md:col-span-1 h-[190px] md:h-[289px] "
          >
            <h4 className="absolute z-10 font-bold text-5xl top-0 left-0 transform translate-y-6 translate-x-9">
              Gym
            </h4>
            <div className="w-full z-0  h-full ">
              <Image
                src="/images/website/Browse By Dress/gym.png"
                className="transform transition-transform duration-300 hover:scale-105 object-cover w-full h-full"
                alt="gym"
                fill
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseByDress;
