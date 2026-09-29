import React from "react";

export const NotFound: React.FC = () => {
  return (
    <div className="bg-white text-black font-mono text-sm selection:bg-black selection:text-white p-6 md:p-12 lg:p-24 max-w-4xl mx-auto rounded-xl">

      <main className="font-mono">
          <p>Sorry, friend. Couldn't find what you wanted.<br/>404 Not Found.</p>
          <a
              href="/"
              className="group inline-flex items-center justify-center bg-black text-white px-5 py-2.5 my-5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-sm"
          >
              Back <span className="ml-1.5 transition-transform group-hover:translate-x-1">&rarr;</span>
          </a>
      </main>
    </div>
  );
};
