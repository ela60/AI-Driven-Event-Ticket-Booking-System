'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  Menu, 
  Ticket, 
  Home, 
  Calendar,
  User, 
  X,
  LayoutDashboard,
  LogOut,
  Info,
  MessageSquare
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { useSession } from 'next-auth/react';

// Dummy NextAuth session structure
// const session = {
//   user: {
//     name: 'Mekat Developers',
//     email: 'mekat@example.com',
//     image: '/api/placeholder/40/40'
//   },
//   expires: '2024-12-31T23:59:59.999Z'
// };


const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigation menu items
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/my-ticket', label: 'My Tickets', icon: Ticket },
    { href:'about' , label: 'About us', icon: Info },
    { href: '/contact', label: 'Contact', icon: MessageSquare  },
  ];

  const profileDropdownItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/api/auth/signout', label: 'Sign Out', icon: LogOut }
  ];

  // Check if a link is active
  const isActiveLink = (href: string) => {
    return pathname === href 
      ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' 
      : 'text-gray-700 hover:text-[var(--color-primary)] hover:bg-gray-100';
  };

  // Render navigation links (used for both desktop and mobile)
  const renderNavLinks = (isMobile: boolean) => {
    const linkClassName = isMobile 
      ? "flex items-center space-x-3 text-lg font-medium px-3 py-2 rounded-md transition-all duration-300 ease-in-out"
      : "flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 ease-in-out";

    return (
      <>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`
                ${linkClassName} 
                ${isActiveLink(item.href)}
                ${isMobile ? 'w-full' : ''}
              `}
              onClick={() => setIsMenuOpen(false)}
            >
              <IconComponent 
                className={`
                  ${isMobile ? 'w-6 h-6' : 'w-5 h-5'} 
                  ${isActive 
                    ? 'text-[var(--color-primary)]' 
                    : 'text-gray-500 group-hover:text-[var(--color-primary)]'
                  } 
                  transition-colors
                `}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Site Name */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-[var(--color-primary)] transition-colors"
        >
          <Ticket className="w-8 h-8 text-[var(--color-primary)]" />
          <span>TicketHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {renderNavLinks(false)}
        </div>

        {/* Authentication and Profile Section */}
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <>
              {/* Desktop Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:block focus:outline-none">
                  <button className="flex items-center space-x-2">
                    <Image 
                      src={session.user.image || '/api/placeholder/40/40'}
                      alt={'U'}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-[var(--color-primary)]" 
                    />
                    
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {profileDropdownItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link 
                          href={item.href}
                          className={`
                            flex items-center 
                            ${isActiveLink(item.href)}
                          `}
                        >
                          <IconComponent className="w-5 h-5 mr-3 text-gray-500" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Sheet */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <button 
                    className="text-gray-800 hover:text-[var(--color-primary)]"
                    aria-label="Toggle mobile menu"
                  >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 p-6 bg-gray-300">
                  <SheetHeader>
                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  </SheetHeader>

                  {/* Logged-in user section for mobile */}
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                    <Image 
                      src={session.user.image || '/api/placeholder/40/40'}
                      alt={'User'}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-[var(--color-primary)]" 
                    />
                    <div>
                      <p className="text-lg font-semibold text-gray-800 truncate max-w-[150px]">
                        {session.user.name}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase text-gray-500 mb-2 px-3">Navigation</h3>
                    {renderNavLinks(true)}
                  </div>

                  {/* Profile Actions */}
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <h3 className="text-xs uppercase text-gray-500 mb-2 px-3">Account</h3>
                    {profileDropdownItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link 
                          key={item.href}
                          href={item.href}
                          className={`
                            flex items-center space-x-3 text-lg font-medium 
                            px-3 py-2 rounded-md transition-all duration-300 ease-in-out
                            ${isActiveLink(item.href)} w-full
                          `}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <IconComponent 
                            className="w-6 h-6 text-gray-500 group-hover:text-[var(--color-primary)] transition-colors" 
                          />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <Link 
                href="/api/auth/signin" 
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:opacity-90 transition-opacity"
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <button 
                    className="text-gray-800 hover:text-[var(--color-primary)]"
                    aria-label="Toggle mobile menu"
                  >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 p-6 bg-gray-300">
                  <SheetHeader>
                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  </SheetHeader>

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase text-gray-500 mb-2 px-3">Navigation</h3>
                    {renderNavLinks(true)}
                  </div>

                  {/* Sign In for Non-Logged In Users */}
                  <Link 
                    href="/api/auth/signin"
                    className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-[var(--color-primary)] px-3 py-2 rounded-md transition-all duration-300 ease-in-out"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-6 h-6 text-gray-500 group-hover:text-[var(--color-primary)] transition-colors" />
                    <span>Sign In</span>
                  </Link>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;