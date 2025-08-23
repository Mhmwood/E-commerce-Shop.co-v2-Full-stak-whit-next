"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, ProductInput } from "@/validations/productSchema";
import { Product } from "@prisma/client";
import { useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/upload/imgeUpload";
import { Button } from "@/components/ui";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { CategoriesList } from "@/constants";

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
    setValue,
    watch,
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
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailError(null);
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setValue("thumbnail", URL.createObjectURL(file), {
        shouldValidate: true,
      });
    } else {
      setThumbnailFile(null);
      setThumbnailPreview(product?.thumbnail || null);
    }
  };

  const handleFormSubmit: SubmitHandler<ProductInput> = async (data) => {
    setThumbnailError(null);
    if (thumbnailFile) {
      try {
        const imageUrl = await uploadImage(thumbnailFile, "products");
        setValue("thumbnail", imageUrl, { shouldValidate: true });
        setThumbnailPreview(imageUrl);
        setThumbnailFile(null);
        data.thumbnail = imageUrl;
      } catch (error: any) {
        console.error("Thumbnail upload error:", error);
        setThumbnailError(error?.message || "Failed to upload thumbnail");
        return;
      }
    }
    await onSubmit({
      ...data,
      thumbnail: data.thumbnail || thumbnailPreview || "",
    });
  };

  // UI/UX upgrade: Card, section titles, Select, Button, optional fields toggle
  const [showOptional, setShowOptional] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const categoryValue = watch("category") || "";
  const isCustom =
    categoryValue === "__custom__" ||
    (!CategoriesList.includes(categoryValue) && categoryValue !== "");
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
      <div className="rounded-2xl border border-gray-700 bg-background/80 shadow-lg p-6 md:p-10">
        <h2 className="text-xl font-bold mb-6 text-primary">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Thumbnail Upload */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <label
              htmlFor="thumbnail"
              className="font-semibold text-sm text-muted-foreground mb-1"
            >
              Thumbnail
            </label>
            <div className="flex items-center gap-6">
              {thumbnailPreview && (
                <Image
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  width={100}
                  height={100}
                  className="rounded-xl border object-cover shadow"
                />
              )}
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
              />
            </div>
            {errors.thumbnail && (
              <p className="mt-2 text-sm text-red-500">
                {errors.thumbnail.message}
              </p>
            )}
            {thumbnailError && (
              <p className="mt-2 text-sm text-red-500">{thumbnailError}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="title"
              className="font-semibold text-sm text-muted-foreground mb-1"
            >
              Title
            </label>
            <input
              {...register("title")}
              id="title"
              className="mt-1 block w-full bg-secondary placeholder:text-gray-400 border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="Product title"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="font-semibold text-sm text-muted-foreground mb-1"
            >
              Description
            </label>
            <textarea
              {...register("description")}
              id="description"
              className="mt-1 block w-full bg-secondary placeholder:text-gray-400 border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none min-h-[80px]"
              placeholder="Product description"
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
              className="font-semibold text-sm text-muted-foreground mb-1"
            >
              Price
            </label>
            <input
              {...register("price", {
                valueAsNumber: true,
                min: { value: 5, message: "Price must be greater than 0" },
              })}
              type="number"
              step="0.01"
              id="price"
              className="mt-1 block w-full bg-secondary placeholder:text-gray-400  border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="$0.00"
            />
            {errors.price && (
              <p className="mt-2 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="stock"
              className="font-semibold text-sm text-muted-foreground mb-1"
            >
              Stock
            </label>
            <input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              id="stock"
              className="mt-1 block w-full bg-secondary placeholder:text-gray-400 border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="0"
            />
            {errors.stock && (
              <p className="mt-2 text-sm text-red-500">
                {errors.stock.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="category"
              className="font-semibold text-sm text-muted-foreground mb-1"
            >
              Category
            </label>
            <Select
              value={isCustom ? "__custom__" : categoryValue}
              onValueChange={(value) => {
                if (value === "__custom__") {
                  const confirmCustom = window.confirm(
                    "Are you sure you want to add a new category?"
                  );
                  if (confirmCustom) {
                    setCustomCategory("");
                    setValue("category", "__custom__", {
                      shouldValidate: true,
                    });
                  } else {
                    setValue("category", categoryValue, {
                      shouldValidate: true,
                    });
                  }
                } else {
                  setCustomCategory("");
                  setValue("category", value, { shouldValidate: true });
                }
              }}
            >
              <SelectTrigger className="w-full bg-secondary placeholder:text-gray-400 border border-gray-700 rounded-lg px-4 py-2 text-primary">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CategoriesList.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="__custom__">Custom...</SelectItem>
              </SelectContent>
            </Select>
            {isCustom && (
              <input
                type="text"
                className="mt-3 block w-full bg-secondary placeholder:text-gray-400 border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="Enter custom category"
                value={
                  categoryValue === "__custom__"
                    ? customCategory
                    : categoryValue
                }
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  setValue("category", e.target.value, {
                    shouldValidate: true,
                  });
                }}
                required
              />
            )}
            {errors.category && (
              <p className="mt-2 text-sm text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button
            type="button"
            variant="ghost"
            className="text-xs px-4 py-2"
            onClick={() => setShowOptional((v) => !v)}
          >
            {showOptional ? "Hide" : "Show"} Optional Fields
          </Button>
        </div>
        {showOptional && (
          <div className="mt-8 border-t border-gray-700 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <h3 className="md:col-span-2 text-lg font-semibold mb-4 text-primary">
              Optional Details
            </h3>
            <div>
              <label
                htmlFor="discountPercentage"
                className="font-semibold text-sm text-muted-foreground mb-1"
              >
                Discount (%)
              </label>
              <input
                {...register("discountPercentage", { valueAsNumber: true })}
                type="number"
                step="0.01"
                id="discountPercentage"
                className="mt-1 block w-full bg-secondary placeholder:text-gray-400 border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="0"
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
                className="font-semibold text-sm text-muted-foreground mb-1"
              >
                Brand
              </label>
              <input
                {...register("brand")}
                id="brand"
                className="mt-1 block w-full bg-secondary placeholder:text-gray-400 border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="Brand name"
              />
              {errors.brand && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.brand.message}
                </p>
              )}
            </div>
            {/* Add more optional fields here as needed */}
          </div>
        )}
        <div className="mt-10">
          <button
            type="submit"
            className="w-full text-lg py-4 rounded-full  border font-bold shadow-md  hover:bg-primary hover:text-white transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading
              ? product
                ? "Updating..."
                : "Creating..."
              : product
              ? "Update Product"
              : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
