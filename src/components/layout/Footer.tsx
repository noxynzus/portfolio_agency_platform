import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

const footerLinks = {
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '#' },
  ],
  Services: [
    { label: 'Web Development', href: '/services' },
    { label: 'Enterprise Systems', href: '/services' },
    { label: 'AI Integration', href: '/services' },
    { label: 'UI/UX Design', href: '/services' },
  ],
  Resources: [
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-cyber-dark border-t border-white/[0.06] overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-sm opacity-40 pointer-events-none" />

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-cyber-cyan/20" />
                <span className="relative text-cyber-cyan font-display font-bold text-base">
                  AC
                </span>
              </div>
              <span className="font-display font-bold text-[1.1rem]">
                Atthawat<span className="text-cyber-cyan">Cha</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Premium Digital Engineering Studio. We craft scalable web applications,
              enterprise systems, and AI-powered solutions that drive real business growth.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyber-cyan/60 flex-shrink-0" />
                <span>Bangkok, Thailand 🇹🇭</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyber-cyan/60 flex-shrink-0" />
                <a
                  href="mailto:hello@techforge.dev"
                  className="hover:text-cyber-cyan transition-colors"
                >
                  hello@techforge.dev
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyber-cyan/60 flex-shrink-0" />
                <a
                  href="tel:+66800000000"
                  className="hover:text-cyber-cyan transition-colors"
                >
                  +66 8 0000 0000
                </a>
              </div>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-white tracking-widest uppercase mb-4">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-cyber-cyan transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {year} Atthawat Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="p-2 text-gray-600 hover:text-cyber-cyan border border-white/[0.06] hover:border-cyber-cyan/20 rounded-lg transition-all duration-200 hover:bg-cyber-cyan/5"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
