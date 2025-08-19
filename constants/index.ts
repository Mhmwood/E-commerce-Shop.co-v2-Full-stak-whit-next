// export const CategoriesList = fetch(
//   process.env.NEXTAUTH_URL! + "/api/categories"
// ).then((r) => r.json());

export const CategoriesList = await fetch(
  "http://localhost:3000/api/categories"
).then(async (r) => {
  const data = await r.json();
  console.log(data); // هنا هتشوف ال Array نفسه
  return data;
});

//.then((data) => data.categories
