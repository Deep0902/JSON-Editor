import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-white px-6 py-4 pb-24 text-sm text-gray-600 md:pb-4">
      <div className="mx-auto flex flex-col items-center justify-between gap-3 md:flex-row md:px-8">
        <p className="text-center text-xs md:text-sm">
          Built with ❤️ Need help or want to connect? &nbsp;
          <a
            href="https://github.com/Deep0902/JSON-Editor/issues"
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md px-2 py-1 font-medium text-gray-900 transition hover:bg-gray-200"
          >
            Having Issues?
          </a>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://github.com/Deep0902/"
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md px-2 py-1 font-medium text-gray-900 transition hover:bg-gray-200"
          >
            GitHub
          </a>
          <a
            href="https://deeps-resume.vercel.app/about"
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md px-2 py-1 font-medium text-gray-900 transition hover:bg-gray-200"
          >
            Portfolio
          </a>
          <a
            href="https://www.linkedin.com/in/deeprakesh/"
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md px-2 py-1 font-medium text-gray-900 transition hover:bg-gray-200"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
