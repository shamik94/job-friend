import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-4 mt-10">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} Job Friend. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
