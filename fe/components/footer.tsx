"use client"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-bold text-lg mb-4 text-primary">TPF Shop</div>
            <p className="text-muted-foreground text-sm">
              Your trusted electronics retailer with the best products and customer service.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-4">Shop</div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/products" className="hover:text-foreground transition">
                All Products
              </Link>
              <Link href="/products?category=Smartphones" className="hover:text-foreground transition">
                Smartphones
              </Link>
              <Link href="/products?category=Tablets" className="hover:text-foreground transition">
                Tablets
              </Link>
              <Link href="/products?category=Computers" className="hover:text-foreground transition">
                Computers
              </Link>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-4">Support</div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/support" className="hover:text-foreground transition">
                Contact Us
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Shipping Info
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Returns
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                FAQs
              </Link>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-4">Company</div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition">
                About Us
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Careers
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2025 TPF Shop. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-foreground transition">
              Facebook
            </Link>
            <Link href="#" className="hover:text-foreground transition">
              Twitter
            </Link>
            <Link href="#" className="hover:text-foreground transition">
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
