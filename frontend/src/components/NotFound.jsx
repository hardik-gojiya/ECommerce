import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <span>Page not found</span>
      <Link className="underline text-blue-600" to="/">Go to Home</Link>
    </div>
  );
}

export default NotFound;
