export const CategoriesList = await fetch(
  `https://e-commerce-shop-co-v2-full-stak-whi.vercel.app/api/categories`,
  {
    cache: "reload",
  }
).then(async (res) => res.json());

// import { getCategories } from "@lib/utils";

// export const CategoriesList = getCategories();

export const MAX_REVIEWS = 10;
export const MAX_Users = 10;
