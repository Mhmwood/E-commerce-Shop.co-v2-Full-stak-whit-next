import { prisma } from "@lib/prisma";

export const updateProductRating = async (productId: string) => {
  const reviews = await prisma.productReview.findMany({ where: { productId } });
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  await prisma.product.update({
    where: { id: productId },
    data: { rating: avgRating },
  });
};
