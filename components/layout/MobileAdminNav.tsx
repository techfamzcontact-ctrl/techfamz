"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Plus, Menu, X } from "lucide-react";

export function MobileAdminNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setOpen(false);

  return (
    <>
      <button 
        onClick={() => setOpen(!open)}
        className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-xl border-t border-border-glass mt-[73px] flex flex-col p-4 h-[calc(100vh-73px)] overflow-y-auto">
          <nav className="flex-1 flex flex-col gap-2 relative z-50">
            <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-2 px-3 mt-2">
              Menu
            </div>
            
            <Link
              href="/admin"
              onClick={closeMenu}
              className={`flex items-center gap-3 px-3 py-4 rounded-lg text-base transition-colors ${
                pathname === '/admin' ? 'bg-bg-card text-accent-blue-light font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            
            <Link
              href="/admin/editor/new"
              onClick={closeMenu}
              className={`flex items-center gap-3 px-3 py-4 rounded-lg text-base transition-colors ${
                pathname === '/admin/editor/new' ? 'bg-bg-card text-accent-blue-light font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
              }`}
            >
              <Plus size={20} />
              New Post
            </Link>
            
            <div className="mt-auto pt-8 pb-4">
              <Link
                href="/blog"
                target="_blank"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-4 rounded-lg text-base text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
              >
                <FileText size={20} />
                View Live Blog
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
