import React from "react";

function Loader() {
  return (
    <div className="absolute top-1 right-1/2 flex items-center justify-center h-20 z-500">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;
