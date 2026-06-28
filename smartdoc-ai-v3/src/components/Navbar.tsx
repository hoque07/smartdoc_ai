import { Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { label: 'Analyzer', href: '#analyzer' },
  { label: 'Story', href: '#story' },
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
  { label: 'Pricing', href: '#pricing' },
];

type NavbarProps = {
  onOpen: () => void;
};

export function Navbar({ onOpen }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/65 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-white/8 shadow-glow">
            <Sparkles className="h-5 w-5 text-skyglow" />
          </span>
          <span className="text-lg font-semibold tracking-tight">SmartDoc AI</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted transition hover:text-white">
              {link.label}
            </a>
          ))}
        </div>

        <button
          onClick={onOpen}
          className="hidden rounded-full border border-white/15 bg-white px-5 py-2.5 text-sm font-semibold text-night shadow-glow transition hover:-translate-y-0.5 hover:bg-skyglow md:inline-flex"
        >
          Request Access
        </button>

        <button
          onClick={() => setOpen((value) => !value)}
          className="rounded-xl border border-white/10 bg-white/8 p-2 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-night/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm text-muted">
                {link.label}
              </a>
            ))}
            <button onClick={onOpen} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-night">
              Request Access
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
