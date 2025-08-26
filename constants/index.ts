export const CategoriesList = await fetch(
  "http://localhost:3000/api/categories"
).then(async (res) => res.json());
