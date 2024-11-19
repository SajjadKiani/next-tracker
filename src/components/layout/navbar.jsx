"use client"

import React from 'react';
import Link from 'next/link';
import { HomeIcon, SearchIcon, BookmarkIcon, WalletIcon, UserIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname()

  const navItems = [
    { to: '/search', icon: SearchIcon, label: 'Search' },
    { to: '/bookmarks', icon: BookmarkIcon, label: 'Bookmarks' },
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/profile', icon: UserIcon, label: 'Profile' },
  ];

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <nav className="fixed bottom-4 left-16 md:left-[40%] md:right-[40%] rounded-full shadow-md right-16 bg-[#262626]/90 py-1 max-w-sm">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className={`p-2 flex gap-1 items-center transition-all duration-500 ease-in-out ${
                pathname === item.to ? 'bg-primary text-white rounded-full ' : 'text-white'
            }`}
            onClick={() => handleScrollToTop()}
          >
            <item.icon className="h-6 w-6" />
            {/* {location.pathname === item.to && (
              <span className="text-xs font-bold">
                {item.label}
              </span>
            )} */}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;