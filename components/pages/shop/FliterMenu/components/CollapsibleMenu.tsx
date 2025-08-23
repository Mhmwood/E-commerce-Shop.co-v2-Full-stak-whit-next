"use client";
import { ChevronRight, Dot } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const CollapsibleMenu = ({ categories }: { categories: string[] }) => {
  // const toggleCollapse = (index: number) => {
  //   setOpenIndexes((prev) =>
  //     prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
  //   );
  // };

  // console.log(categories);
  // categories.map((c) => console.log("<=>", c));

  const router = useRouter();
  const params = useSearchParams();

  const openIndexes = params.get("category");

  return (
    <div className="w-full space-y-1">
      {categories.map((category, index) => {
        const isActive = openIndexes === category;

        return (
          <div
            key={index}
            className={`rounded-lg  transition-all duration-300${
              isActive &&
              "bg-gray-300 border-l-4 border-primary scale-[1.02] shadow"
            }`}
          >
            <button
              onClick={() =>
                router.push(`shop/?category=${encodeURIComponent(category)}`)
              }
              className="flex w-full items-center justify-between p-3 text-left text-sm font-medium cursor-pointer rounded-lg transition"
            >
              {category}
              <ChevronRight
                className={`h-5 w-5 transition-transform`}
                //  ${
                //   openIndexes.includes(index) ? "rotate-90" : ""
                // }
              />
            </button>

            {/* {openIndexes.includes(index) && (
              <ul className="space-y-1 pl-4">
                {category.list.map((item) => (
                  <li className=" flex items-center  w-full" key={item}>
                    <a
                      className="text-gray-500 cursor-pointer hover:underline hover:text-primary flex items-center "
                      onClick={() => navigate(`/shop/${item}`)}
                    >
                      <Dot /> {item}
                    </a>
                  </li>
                ))}
              </ul>
            )} */}
          </div>
        );
      })}
    </div>
  );
};

export default CollapsibleMenu;
