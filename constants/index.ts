export const CategoriesList = await fetch(
  "http://localhost:3000/api/categories",
).then(async (res) => res.json());

export const MAX_REVIEWS = 10;
export const MAX_Users = 10;
