'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Search, User, ChevronDown } from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {/* Top Bar - Can scroll away */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Left Column - Brand Logo */}
            <div className="flex items-center space-x-3">
              <Image 
                src="/images/landing/logo-flowify.png" 
                alt="Flowify" 
                width={500}
                height={100}
                className="w-50 h-10"
              />
              {/* <div className="flex flex-col">
                <span className="font-bold text-xl text-[#1A1A1A]">Flowify Portal</span>
                <span className="text-xs text-[#888888]">by Travelner</span>
              </div> */}
            </div>

            {/* Center Column - Search Bar (Hidden on mobile) */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#888888]" />
                </div>
                <Input
                  type="text"
                  placeholder="Type your keywords..."
                  className="w-full pl-10 pr-20 py-2 bg-[#F3F4F6] border-0 rounded-md text-sm placeholder:text-[#888888] focus:ring-2 focus:ring-[#8B5CF6] focus:bg-white"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-4 bg-white border-[#D1D5DB] text-[#333333] hover:bg-gray-50"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Right Column - User Account Area */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <span className="text-sm text-[#333333]">
                  Hello: <span className="font-semibold">Guest</span>
                </span>
                <div className="w-px h-4 bg-gray-300"></div>
                <Link href="/login" className="text-sm font-semibold text-[#333333] hover:text-[#8B5CF6] transition-colors">
                  Login
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-[#333333] hover:text-[#8B5CF6] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Always sticky at top */}
      <nav className="bg-[#F4F6F8] border-t border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Side - Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-[#333333] hover:text-[#8B5CF6] transition-colors">
                  <span>Financial Information</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {/* Dropdown menu can be added here */}
              </div>
              <Link href="#rush" className="text-sm font-medium text-[#333333] hover:text-[#8B5CF6] transition-colors">
                Rush Service
              </Link>
              <Link href="#status" className="text-sm font-medium text-[#333333] hover:text-[#8B5CF6] transition-colors">
                Check Status
              </Link>
              <Link href="#contact" className="text-sm font-medium text-[#333333] hover:text-[#8B5CF6] transition-colors">
                Contact Us
              </Link>
            </div>

            {/* Mobile Navigation Menu */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-[#333333] hover:text-[#8B5CF6] transition-colors"
              >
                <span>Menu</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Right Side - CTA Button */}
            <Button 
              size="sm" 
              className="bg-[#F8931F] hover:bg-[#F8931F]/90 text-white font-semibold px-6 py-2 rounded-md transition-colors"
              asChild
            >
              <Link href="/register">Apply Now</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto max-w-7xl px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#888888]" />
                </div>
                <Input
                  type="text"
                  placeholder="Type your keywords..."
                  className="w-full pl-10 py-2 bg-[#F3F4F6] border-0 rounded-md text-sm placeholder:text-[#888888]"
                />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-3">
                <Link href="#info" className="block text-sm font-medium text-[#333333] hover:text-[#8B5CF6] transition-colors">
                  Financial Information
                </Link>
                <Link href="#rush" className="block text-sm font-medium text-[#333333] hover:text-[#8B5CF6] transition-colors">
                  Rush Service
                </Link>
                <Link href="#status" className="block text-sm font-medium text-[#333333] hover:text-[#8B5CF6] transition-colors">
                  Check Status
                </Link>
                <Link href="#contact" className="block text-sm font-medium text-[#333333] hover:text-[#8B5CF6] transition-colors">
                  Contact Us
                </Link>
              </div>

              {/* Mobile User Account */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="text-sm text-[#333333]">
                    Hello: <span className="font-semibold">Guest</span>
                  </span>
                </div>
                <Link href="/login" className="block text-sm font-semibold text-[#333333] hover:text-[#8B5CF6] transition-colors">
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}