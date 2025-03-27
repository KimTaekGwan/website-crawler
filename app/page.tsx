import Link from "next/link"
import { ArrowRight, Camera, LayoutDashboard, MonitorSmartphone, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Camera className="h-5 w-5" />
          <span>WebCapture Pro</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">
              대시보드로 이동
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="mb-4 flex items-center justify-center space-x-2 rounded-full bg-primary/10 px-4 py-1 text-sm text-primary">
                <span>WebCapture Pro</span>
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                <span>다양한 디바이스 환경에서 웹사이트 캡처</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                웹사이트를 다양한 환경에서 <br /> 
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">캡처하고 분석하세요</span>
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                웹사이트의 반응형 디자인을 다양한 디바이스 환경에서 확인하고, <br />
                AI 기반 분석으로 메뉴 구조와 사용자 경험을 개선하세요.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/captures/new">
                    <Camera className="h-4 w-4" />
                    캡처 시작하기
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    대시보드 보기
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  주요 기능
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed">
                  WebCapture Pro의 강력한 기능으로 웹사이트 디자인을 더 효율적으로 관리하세요.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MonitorSmartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">다양한 디바이스 캡처</h3>
                <p className="text-muted-foreground">
                  데스크톱, 태블릿, 모바일 등 다양한 환경에서 웹사이트를 캡처하고 비교하세요.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Tag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">태그 시스템</h3>
                <p className="text-muted-foreground">
                  캡처된 웹사이트를 태그로 구분하고 관리하여 쉽게 찾을 수 있습니다.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-6 w-6 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">AI 분석</h3>
                <p className="text-muted-foreground">
                  AI 기반 메뉴 구조 분석으로 웹사이트의 사용자 경험을 개선하세요.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  지금 바로 시작하세요
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed">
                  WebCapture Pro로 웹사이트의 디자인과 사용자 경험을 개선해보세요.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/captures/new">
                    지금 캡처 시작하기
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-6 md:px-12 items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          <p className="text-sm text-muted-foreground">
            © 2025 WebCapture Pro. All rights reserved.
          </p>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-xs text-muted-foreground hover:underline underline-offset-4" href="#">
            이용약관
          </Link>
          <Link className="text-xs text-muted-foreground hover:underline underline-offset-4" href="#">
            개인정보처리방침
          </Link>
        </nav>
      </footer>
    </div>
  )
}