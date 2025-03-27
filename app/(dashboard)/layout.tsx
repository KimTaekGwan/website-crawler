"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { 
  BarChart3, 
  Camera, 
  Laptop, 
  Layers, 
  LayoutDashboard, 
  Settings, 
  Tag as TagIcon 
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Camera className="h-5 w-5" />
          <span>WebCapture Pro</span>
        </Link>
        <nav className="flex-1">
          <DashboardNav />
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9"
          >
            <span>계정 설정</span>
            <Settings className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <div className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
          <nav className="sticky top-16 p-4 pt-6">
            <div className="space-y-1">
              <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
                대시보드
              </h2>
              <NavLink href="/dashboard" icon={<LayoutDashboard className="mr-2 h-4 w-4" />}>
                개요
              </NavLink>
              <NavLink href="/captures" icon={<Camera className="mr-2 h-4 w-4" />}>
                캡처
              </NavLink>
              <NavLink href="/tags" icon={<TagIcon className="mr-2 h-4 w-4" />}>
                태그
              </NavLink>
            </div>
            <div className="space-y-1 pt-6">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                분석
              </h2>
              <NavLink href="/menu-analysis" icon={<Layers className="mr-2 h-4 w-4" />}>
                메뉴 구조
              </NavLink>
              <NavLink href="/device-analysis" icon={<Laptop className="mr-2 h-4 w-4" />}>
                디바이스 호환성
              </NavLink>
              <NavLink href="/statistics" icon={<BarChart3 className="mr-2 h-4 w-4" />}>
                통계
              </NavLink>
            </div>
          </nav>
        </div>
        <main className="flex-1 p-6 pt-3">{children}</main>
      </div>
    </div>
  )
}

function DashboardNav() {
  const pathname = usePathname()
  
  return (
    <div className="flex items-center gap-4 lg:gap-6">
      <MobileNavLink
        href="/dashboard"
        active={pathname === "/dashboard"}
      >
        개요
      </MobileNavLink>
      <MobileNavLink
        href="/captures"
        active={pathname === "/captures" || pathname.startsWith("/captures/")}
      >
        캡처
      </MobileNavLink>
      <MobileNavLink
        href="/tags"
        active={pathname === "/tags" || pathname.startsWith("/tags/")}
      >
        태그
      </MobileNavLink>
      <MobileNavLink
        href="/menu-analysis"
        active={pathname === "/menu-analysis" || pathname.startsWith("/menu-analysis/")}
      >
        분석
      </MobileNavLink>
    </div>
  )
}

interface NavLinkProps {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
}

function NavLink({ href, icon, children }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)
  
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      {children}
    </Link>
  )
}

interface MobileNavLinkProps {
  href: string;
  active: boolean;
  children: ReactNode;
}

function MobileNavLink({ href, active, children }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "hidden text-sm font-medium transition-colors md:block",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  )
}