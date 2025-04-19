'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };
  
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                Food Tracker
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/' ? 'border-white' : 'border-transparent'
                } ${isActive('/')}`}
              >
                Home
              </Link>
              <Link
                href="/register"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/register' ? 'border-white' : 'border-transparent'
                } ${isActive('/register')}`}
              >
                Register
              </Link>
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/dashboard' ? 'border-white' : 'border-transparent'
                } ${isActive('/dashboard')}`}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/' ? 'bg-blue-700 border-white' : 'border-transparent'
            }`}
          >
            Home
          </Link>
          <Link
            href="/register"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/register' ? 'bg-blue-700 border-white' : 'border-transparent'
            }`}
          >
            Register
          </Link>
          <Link
            href="/dashboard"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/dashboard' ? 'bg-blue-700 border-white' : 'border-transparent'
            }`}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
} 