export const CategoriesList = await fetch(
  `${process.env.NEXTAUTH_URL}/api/categories`,
  {
    cache: "reload",
  }
).then(async (res) => res.json());

export const MAX_REVIEWS = 10;
export const MAX_Users = 10;
