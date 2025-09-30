"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, ProductInput } from "@validations/productSchema";
import { Product } from "@prisma/client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ShowLoader from "@components/ui/Loaders/ShowLoader";
import { uploadImage } from "@lib/upload/imgeUpload";
import { updateImage } from "@lib/upload/updateImg";
import { Button } from "@components/ui";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@components/ui/select";
//import { CategoriesList } from "@constants/index";
import { CirclePlus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel";
import { Trash, Edit } from "lucide-react";
import { getCategories } from "@lib/utils";

interface ProductFormProps {
  onSubmit: (data: ProductInput) => Promise<void>;
  product?: Product;
  isLoading: boolean;
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  product,
  isLoading,
  isEdit = false,
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

  const [images, setImages] = useState<(File | null)[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);

  const createdBlobUrls = useRef<string[]>([]);
  const originalImageUrls = useRef<(string | null)[]>([]);

  useEffect(() => {
    getCategories().then(setCategory);
    if (product?.images && product.images.length > 0) {
      setImagePreviews(product.images);
      setImages(product.images.map(() => null));
      setImageErrors(product.images.map(() => ""));

      originalImageUrls.current = product.images.slice();
    }
  }, [product]);

  const handleAddImage = () => {
    if (images.length >= 3) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setImages((prev) => [...prev, file]);
      setImagePreviews((prev) => [...prev, url]);
      setImageErrors((prev) => [...prev, ""]);
      createdBlobUrls.current.push(url);
      originalImageUrls.current.push(null);
    };
    input.click();
  };

  const handleImageDelete = (index: number) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];
    const updatedErrors = [...imageErrors];

    const removedPreview = updatedPreviews.splice(index, 1)[0];
    if (removedPreview && removedPreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(removedPreview);
        createdBlobUrls.current = createdBlobUrls.current.filter(
          (u) => u !== removedPreview
        );
      } catch {}
    }

    updatedImages.splice(index, 1);
    updatedErrors.splice(index, 1);
    originalImageUrls.current.splice(index, 1);

    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
    setImageErrors(updatedErrors);
  };

  const handleImageEdit = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];
    const updatedErrors = [...imageErrors];

    if (file) {
      updatedImages[index] = file;
      updatedPreviews[index] = URL.createObjectURL(file);
      updatedErrors[index] = "";
    } else {
      updatedImages[index] = null;
      updatedPreviews[index] = "";
      updatedErrors[index] = "Failed to upload image.";
    }

    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
    setImageErrors(updatedErrors);
  };

  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit: SubmitHandler<ProductInput> = async (data) => {
    setSubmitting(true);
    const finalImageUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const originalUrl = originalImageUrls.current[i] ?? null;

      if (image instanceof File) {
        try {
          if (originalUrl) {
            // replace existing remote image
            const updatedUrl = await updateImage(
              originalUrl,
              image,
              "products"
            );
            finalImageUrls.push(updatedUrl);
          } else {
            // newly added image
            const uploaded = await uploadImage(image, "products");
            finalImageUrls.push(uploaded);
          }
        } catch (error) {
          console.error("Image upload/update error:", error);
          setSubmitting(false);
          return;
        }
      } else {
        // image is null -> either an unchanged original URL or a placeholder; preserve original if present
        if (originalUrl) {
          finalImageUrls.push(originalUrl);
        }
        // otherwise this slot was probably emptied/invalid; skip
      }
    }

    setThumbnailError(null);
    if (thumbnailFile) {
      try {
        let thumbnailUrl: string | null = null;
        if (isEdit && product?.thumbnail) {
          thumbnailUrl = await updateImage(
            product.thumbnail,
            thumbnailFile,
            "products"
          );
        } else {
          thumbnailUrl = await uploadImage(thumbnailFile, "products");
        }

        setValue("thumbnail", thumbnailUrl!, { shouldValidate: true });
        setThumbnailPreview(thumbnailUrl);
        setThumbnailFile(null);
        data.thumbnail = thumbnailUrl!;
      } catch (error: unknown) {
        console.error("Thumbnail upload error:", error);
        const message = error instanceof Error ? error.message : String(error);
        setThumbnailError(message || "Failed to upload thumbnail");
        setSubmitting(false);
        return;
      }
    }
    try {
      await onSubmit({
        ...data,
        thumbnail: data.thumbnail || thumbnailPreview || "",
        images: finalImageUrls,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const [showOptional, setShowOptional] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const categoryValue = watch("category") || "";
  const isCustom = 
    categoryValue === "__custom__" ||
    (!category.includes(categoryValue) && categoryValue !== "");
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
      {/* Fullscreen submitting overlay */}
      {(submitting || isLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="p-6 rounded-lg bg-background/90 border border-gray-700 shadow-lg">
            <ShowLoader />
          </div>
        </div>
      )}
      <div className="rounded-2xl border border-gray-700 bg-background/80 shadow-lg p-6 md:p-10">
        <h2 className="text-xl font-bold mb-6 text-primary">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          {imagePreviews.length > 0 ? (
            <>
              <Carousel className="relative mx-5 ">
                <CarouselContent>
                  {imagePreviews.map((preview, index) => (
                    <CarouselItem key={index} className="relative">
                      <Image
                        src={preview}
                        alt={`Image Preview ${index + 1}`}
                        width={800}
                        height={500}
                        className="rounded-xl border object-cover shadow w-full h-64"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleImageDelete(index)}
                          className="rounded-full p-1 cursor-pointer border border-gray-700 hover:bg-red-500 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                          title="Delete image"
                        >
                          <Trash className="size-6" strokeWidth={1.75} />
                        </button>
                        <label
                          htmlFor={`edit-image-${index}`}
                          className="rounded-full p-1 cursor-pointer border border-gray-700 hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40"
                          title="Change image"
                        >
                          <Edit className="size-6" strokeWidth={1.75} />
                        </label>
                        <input
                          type="file"
                          id={`edit-image-${index}`}
                          accept="image/*"
                          onChange={(e) => handleImageEdit(index, e)}
                          className="hidden"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              {images.length < 3 && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="rounded-full px-4 py-2 border border-gray-700 hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Add more image
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
              <p className="mb-4 text-muted-foreground">No images yet</p>
              <button
                type="button"
                onClick={handleAddImage}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 border border-gray-700 hover:bg-primary hover:text-white transition-all duration-300"
              >
                <CirclePlus />
                Add Image
              </button>
            </div>
          )}

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
                {category.map((cat: string) => (
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
          </div>
        )}
        <div className="mt-10">
          <button
            type="submit"
            className="w-full text-lg py-4 rounded-full  border font-bold shadow-md  hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-60"
            disabled={isLoading || submitting}
          >
            {submitting || isLoading
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
