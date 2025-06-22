import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <Link href={'/'} className="flex items-center ">
      <img src="/bubu-logo.webp" alt="Logo" className="h-8 w-auto" />
      <span className="bg-gradient-to-r from-orange-500 to-rose-700 bg-clip-text text-xl font-bold text-transparent">
        BuBu Scraper
      </span>
    </Link>
  );
};

export default Logo;
