import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { NavLinks } from "@/types/navlink";

function BreadcrumbBar({ secondLink = "", link = "", name }: NavLinks) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {secondLink ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/${link}`}>{secondLink}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/shop">Shop</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {name && (
          <>
            <BreadcrumbItem>
              <BreadcrumbPage>{name}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbBar;

// import { useRouter } from "next/navigation";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "../ui/breadcrumb";
// import { NavLinks } from "@/types/navlink";

// function BreadcrumbBar({ secondLink = "", link = "", name }: NavLinks) {
//   const router = useRouter();
//   return (
//     <Breadcrumb>
//       <BreadcrumbList>
//         <BreadcrumbItem>
//           <BreadcrumbLink href="/">Home</BreadcrumbLink>
//         </BreadcrumbItem>
//         <BreadcrumbSeparator />
//         <BreadcrumbItem>
//           <BreadcrumbLink href={!secondLink ? "/shop" : `/${link}`}>
//             {!secondLink ? "Shop" : secondLink}
//           </BreadcrumbLink>
//         </BreadcrumbItem>
//         {link && <BreadcrumbSeparator />}
//         <BreadcrumbItem
//           className="cursor-pointer"
//           onClick={() => router.push(`/shop/${link}`)}
//         >
//           <BreadcrumbLink>{link}</BreadcrumbLink>
//         </BreadcrumbItem>
//         {name && <BreadcrumbSeparator />}
//         <BreadcrumbItem>
//           <BreadcrumbPage>{name}</BreadcrumbPage>
//         </BreadcrumbItem>
//       </BreadcrumbList>
//     </Breadcrumb>
//   );
// }

// export default BreadcrumbBar;
