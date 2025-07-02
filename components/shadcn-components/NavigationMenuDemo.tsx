import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";

function NavigationMenuDemo({ categories }: { categories: string[] }) {
  const router = useRouter();
  // const navigate = useNavigate();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="">Shop</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid  gap-3 py-3 px-4 w-[20rem] grid-cols-2  md:w-[500px] md:grid-cols-3 lg:w-[600px]  ">
              <ul>
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className=" text-sm md:text-lg font-bold text-primary"
                    onClick={() =>
                      router.push(
                        `shop/?category=${encodeURIComponent(category)}`
                      )
                    }
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavigationMenuDemo;
