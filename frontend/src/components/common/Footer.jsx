import React from 'react';

const Footer = () => {
  return (
    <footer className="px-6 py-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()} ALMATIQ. All rights reserved.
        </div>
        <div className="flex gap-8 text-sm">
          <a href="#" className="text-gray-400 hover:text-primary transition-colors">Platform</a>
          <a href="#" className="text-gray-400 hover:text-primary transition-colors">Company</a>
          <a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="text-gray-400 hover:text-primary transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
