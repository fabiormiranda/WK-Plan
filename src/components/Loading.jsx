// src/components/Loading.jsx
import React from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
    </div>
  );
}

export default Loading;
