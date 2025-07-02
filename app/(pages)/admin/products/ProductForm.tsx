"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, ProductInput } from "@/validations/productSchema";
import { Product } from "@prisma/client";
import { useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/upload/imgeUpload";

interface ProductFormProps {
  onSubmit: (data: ProductInput) => Promise<void>;
  product?: Product;
  isLoading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  product,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: product
      ? {
          ...product,
          category: product.category || "",
          brand: product.brand || undefined,
          sku: product.sku || undefined,
          warrantyInformation: product.warrantyInformation || undefined,
          shippingInformation: product.shippingInformation || undefined,
          availabilityStatus: product.availabilityStatus || undefined,
          returnPolicy: product.returnPolicy || undefined,
          weight: product.weight || undefined,
          minimumOrderQuantity: product.minimumOrderQuantity || undefined,
          discountPercentage: product.discountPercentage || undefined,
        }
      : {},
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    product?.thumbnail || null
  );

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit: SubmitHandler<ProductInput> = async (data) => {
    if (thumbnailFile) {
      try {
        const imageUrl = await uploadImage(thumbnailFile, "products");
        data.thumbnail = imageUrl;
      } catch (error) {
        console.error("Failed to upload thumbnail", error);
        // Optionally, handle upload error in the UI
        return;
      }
    }
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thumbnail Upload */}
        <div className="md:col-span-2">
          <label
            htmlFor="thumbnail"
            className="block text-sm font-medium text-gray-300"
          >
            Thumbnail
          </label>
          <div className="mt-1 flex items-center gap-4">
            {thumbnailPreview && (
              <Image
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
            )}
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>
          {errors.thumbnail && (
            <p className="mt-2 text-sm text-red-500">
              {errors.thumbnail.message}
            </p>
          )}
        </div>

        {/* Required Fields */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300"
          >
            Title
          </label>
          <input
            {...register("title")}
            id="title"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            {...register("description")}
            id="description"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Price
          </label>
          <input
            {...register("price", { valueAsNumber: true })}
            type="number"
            step="0.01"
            id="price"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white"
          />
          {errors.price && (
            <p className="mt-2 text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-300"
          >
            Stock
          </label>
          <input
            {...register("stock", { valueAsNumber: true })}
            type="number"
            id="stock"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white"
          />
          {errors.stock && (
            <p className="mt-2 text-sm text-red-500">{errors.stock.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <input
            {...register("category")}
            id="category"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white"
          />
          {errors.category && (
            <p className="mt-2 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Optional Fields */}
        <div>
          <label
            htmlFor="discountPercentage"
            className="block text-sm font-medium text-gray-300"
          >
            Discount Percentage
          </label>
          <input
            {...register("discountPercentage", { valueAsNumber: true })}
            type="number"
            step="0.01"
            id="discountPercentage"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white"
          />
          {errors.discountPercentage && (
            <p className="mt-2 text-sm text-red-500">
              {errors.discountPercentage.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-300"
          >
            Brand
          </label>
          <input
            {...register("brand")}
            id="brand"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white"
          />
          {errors.brand && (
            <p className="mt-2 text-sm text-red-500">{errors.brand.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
      >
        {isLoading
          ? product
            ? "Updating..."
            : "Creating..."
          : product
          ? "Update Product"
          : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
