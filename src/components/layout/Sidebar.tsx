import Link from 'next/link'
import { BarChart3, Users, Target, RefreshCw, BookOpen } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/ciclos', label: 'Ciclos', icon: RefreshCw },
  { href: '/objetivos', label: 'Objetivos', icon: Target },
  { href: '/profissionais', label: 'Profissionais', icon: Users },
]

export function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="px-6 py-5 border-b border-slate-700">
        <span className="text-lg font-semibold tracking-tight">MetaSepdi</span>
        <p className="text-xs text-slate-400 mt-0.5">OKR & PDI</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
