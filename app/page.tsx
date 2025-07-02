import BrowseByDress from "@/components/pages/home/BrowseByDress";
import Hero from "@/components/pages/home/Hero/Hero";
import OurHappyCustomers from "@/components/pages/home/OurHappyCustomers";
import { ProductSection } from "@/components/products";

const HomePage = () => {
  return (
    <main className="mt-16">
      <Hero />
      <ProductSection
        title="NEW ARRIVALS"
        sortBy="price"
        limit={10}
        order="desc"
      />
      <div className="px-4 md:px-20">
        <hr className="  my-8  border border-gray-300" />
      </div>
      <ProductSection
        title="Top Selling"
        sortBy="title"
        order="desc"
        limit={10}
      />
      <BrowseByDress />
      <OurHappyCustomers />
    </main>
  );
};

export default HomePage;
