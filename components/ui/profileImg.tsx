"use client";

import React from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

interface ProfileImgProps {
  imagePreview?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: number;
  className?: string;
  msg?: string;
}

const ProfileImg: React.FC<ProfileImgProps> = ({
  imagePreview = "/defaultProfile.png",
  onChange,
  size = 80,
  className = "",
  msg = "profile picture.",
}) => {
  const msgText = (msg.split("to").pop() ?? "").trim();
  return (
    <div
      className={`flex flex-col sm:flex-row items-center mb-6 gap-4 ${className}`}
    >
      <div className="relative">
        {imagePreview && (
          <Image
            src={imagePreview}
            alt={msgText}
            width={size}
            height={size}
            className="rounded-full object-cover border-2 border-primary shadow-md"
          />
        )}

        <label
          htmlFor={msgText}
          className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-primary/80 transition-colors"
          title={msgText}
        >
          <Camera size={16} />
          <input
            id={msgText}
            type="file"
            accept="image/*"
            onChange={onChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <p className="text-sm text-gray-500">Allowed: JPG, PNG.</p>
        <p className="text-xs text-gray-400 mt-1">{msg}</p>
      </div>
    </div>
  );
};

export default ProfileImg;
