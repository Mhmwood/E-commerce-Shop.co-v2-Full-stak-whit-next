

// http://localhost:3000/undefined/api/products?limit=10&sortBy=price&sortOrder=desc&select=title,images,thumbnail,price,rating,discountPercentage,id
export const CategoriesList = await fetch(`http://localhost:3000/api/categories`, {
  cache: "reload",
}).then(async (res) => res.json());

// import { getCategories } from "@lib/utils";

// export const CategoriesList = getCategories();

export const MAX_REVIEWS = 10;
export const MAX_Users = 10;
