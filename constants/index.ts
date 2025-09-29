export const BASE_URL =
  process.env.NODE_ENV == "production" ? process.env.NEXTAUTH_URL : "";

export const CategoriesList = await fetch(`${BASE_URL}/api/categories`, {
  cache: "reload",
}).then(async (res) => res.json());

// import { getCategories } from "@lib/utils";

// export const CategoriesList = getCategories();

export const MAX_REVIEWS = 10;
export const MAX_Users = 10;
