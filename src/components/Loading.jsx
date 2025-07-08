import React from "react";

function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--color-accent)]"></div>
    </div>
  );
}

export default Loading;
