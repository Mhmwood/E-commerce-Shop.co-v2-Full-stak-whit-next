"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { uploadImage } from "@/lib/upload/imgeUpload";
import Image from "next/image";
import { updateImage } from "@/lib/upload/updateImg";

const ProfilePage = () => {
  const {
    session,
    isLoading,
    updateUserProfile,
    changeUserPassword,
    loading: authLoading,
    error: authError,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setImagePreview(session.user.image || null);
    }
  }, [session]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    let imageUrl = session?.user?.image;

    if (image) {
      try {
        if (imageUrl) {
          imageUrl = await updateImage(imageUrl, image, "avatars");
        } else {
          imageUrl = await uploadImage(image, "avatars");
        }
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        setError("Failed to upload image.");
        return;
      }
    }

    const result = await updateUserProfile({
      name,
      email,
      image: imageUrl ?? undefined,
    });
    if (result.success) {
      setMessage("Profile updated successfully!");
    } else {
      setError(result.error || "Failed to update profile.");
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    const result = await changeUserPassword({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    if (result.success) {
      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } else {
      setError(result.error || "Failed to change password.");
    }
  };

  if (isLoading || !session?.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-10 md:py-20 px-4 md:px-20 mt-10">
      <div className="rounded-2xl border flex flex-col md:flex-row flex-wrap p-5 md:p-8 ">
        <div className="w-full md:flex border-b pb-4 ">
          <div className="p-4 flex flex-col w-full md:w-1/4 items-center md:items-start">
            <figure>
              <Image
                src={imagePreview || "/defaultProfile.png"}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full bg-gray-400 size-20 object-cover"
              />
            </figure>
            <div className="mt-4 text-center md:text-left">
              <h5 className="text-lg font-bold whitespace-nowrap">
                {name || "Your Name"}
              </h5>
              <p className="text-lg font-semibold text-gray-400">
                {session?.user?.id || "3822JF"}
              </p>
            </div>
          </div>

          <figure className="rounded-[1.25rem] w-full flex items-center justify-center">
            {/* Optionally, you can show a cover image or a placeholder */}
            <div className="bg-gray-400 w-full h-60 rounded-2xl flex items-center justify-center">
              {/* You can add a cover image here if available */}
            </div>
          </figure>
        </div>

        <div className="w-full md:flex justify-between *:w-full md:*:w-1/3 p-4">
          <div className="p-4 md:even:border-l-2 border-0">
            <h5 className="text-lg font-semibold uppercase whitespace-nowrap">
              email
            </h5>
            <p className="text-lg text-gray-400">
              {email || "example@email.com"}
            </p>
          </div>
          <div className="p-4 md:even:border-l-2 border-0 ">
            <h5 className="text-lg font-semibold uppercase whitespace-nowrap">
              address
            </h5>
            <p className="text-lg text-gray-400">{"Your address"}</p>
          </div>
          <div className="p-4 md:even:border-l-2 border-0 ">
            <h5 className="text-lg font-semibold uppercase whitespace-nowrap">
              location
            </h5>
            <p className="text-lg text-gray-400">{"Your location"}</p>
          </div>
        </div>
      </div>

      {/* Profile Update Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 mt-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        {message && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
            {error}
          </div>
        )}
        {authError && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
            {authError}
          </div>
        )}
        <form onSubmit={handleProfileUpdate}>
          <div className="flex items-center mb-4">
            <Image
              src={imagePreview || "/defaultProfile.png"}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full mr-4"
            />
            <input type="file" onChange={handleImageChange} accept="image/*" />
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary "
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary "
            />
          </div>
          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-full py-4 px-8 border-2 hover:bg-primary hover:text-white transition-all duration-300"
          >
            {authLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Password Change Form */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary "
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary "
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary "
            />
          </div>
          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-full py-4 px-8 border-2 hover:bg-primary hover:text-white transition-all duration-300"
          >
            {authLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
