"use client";

import { signOut } from 'next-auth/react';
import React from 'react'

const F = () => {
  return (
    <div>
      <button
        onClick={() => signOut()}
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        Log out
      </button>
    </div>
  );
}

export default F
