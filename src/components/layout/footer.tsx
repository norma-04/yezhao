// ─── 野造 · Footer ───
import Link from 'next/link'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

const footerLinks = {
  平台: [
    { label: '关于野造', href: '/about' },
    { label: '新手指南', href: '/guide' },
    { label: '成为讲师', href: '/teach' },
  ],
  帮助: [
    { label: '常见问题', href: '/faq' },
    { label: '材料购买指南', href: '/materials' },
    { label: '社区规范', href: '/community-rules' },
  ],
  联系: [
    { label: '邮箱联系', href: `mailto:${SITE_CONFIG.links.email}` },
    { label: '微信公众号', href: '#' },
    { label: '微博', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-clay-200/60 bg-clay-50/80 mt-auto">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-xl font-semibold text-clay-700">
              野造
            </Link>
            <p className="mt-3 text-sm text-clay-500 leading-relaxed max-w-48">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-serif text-sm font-medium text-clay-700 mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-clay-500 hover:text-clay-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-clay-200/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-clay-400">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-clay-400">
            <Mail className="h-4 w-4 hover:text-clay-600 cursor-pointer transition-colors" />
            <MessageCircle className="h-4 w-4 hover:text-clay-600 cursor-pointer transition-colors" />
            <Phone className="h-4 w-4 hover:text-clay-600 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  )
}
