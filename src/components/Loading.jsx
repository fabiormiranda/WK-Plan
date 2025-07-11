import React from "react";

/**
 * Loading component for WK-Plan.
 * - Displays a centered, semi-transparent overlay with a spinning loader.
 * - Uses Tailwind classes for styling and animation.
 */
function Loading() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[var(--color-bg)] bg-opacity-80 z-50"
    >
      {/* Spinning loader */}
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--color-accent)]"
      ></div>
    </div>
  );
}

export default Loading;
