"use client"

import Link from "next/link"
import { 
  ArrowUpRight, 
  Clock, 
  ExternalLink, 
  Globe, 
  LayoutGrid, 
  Layers, 
  MonitorSmartphone, 
  Plus, 
  Tag as TagIcon 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  // Mock stats data
  const stats = {
    totalCaptures: 28,
    activeCaptures: 3,
    totalScreenshots: 156,
    totalWebsites: 12,
    totalTags: 24,
    averageScreenshotsPerCapture: 5.6
  }
  
  // Mock recent captures data
  const recentCaptures = [
    {
      id: 1,
      url: "https://example.com",
      domain: "example.com",
      name: "Example Website",
      status: "completed",
      createdAt: "2025년 3월 27일",
      screenshotCount: 6,
      pageCount: 3,
      progress: 100
    },
    {
      id: 2,
      url: "https://blog.example.com",
      domain: "blog.example.com",
      name: "Example Blog",
      status: "in_progress",
      createdAt: "2025년 3월 26일",
      screenshotCount: 4,
      pageCount: 5,
      progress: 60
    },
    {
      id: 3,
      url: "https://store.example.com",
      domain: "store.example.com",
      name: "Example Store",
      status: "completed",
      createdAt: "2025년 3월 24일",
      screenshotCount: 12,
      pageCount: 8,
      progress: 100
    }
  ]
  
  // Mock popular tags data
  const popularTags = [
    { id: 1, name: "포트폴리오", color: "#3B82F6", count: 8 },
    { id: 2, name: "블로그", color: "#10B981", count: 5 },
    { id: 3, name: "기업", color: "#6366F1", count: 12 },
    { id: 4, name: "이커머스", color: "#EC4899", count: 6 },
    { id: 5, name: "뉴스", color: "#F59E0B", count: 4 }
  ].sort((a, b) => b.count - a.count)
  
  // Placeholder for chart data
  const chartData = [
    { date: "3/21", captures: 2, screenshots: 8 },
    { date: "3/22", captures: 1, screenshots: 5 },
    { date: "3/23", captures: 3, screenshots: 15 },
    { date: "3/24", captures: 2, screenshots: 12 },
    { date: "3/25", captures: 0, screenshots: 0 },
    { date: "3/26", captures: 1, screenshots: 4 },
    { date: "3/27", captures: 1, screenshots: 6 }
  ]
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          WebCapture Pro에 오신 것을 환영합니다! 캡처 현황과 웹사이트 관리 개요를 확인하세요.
        </p>
      </div>
      
      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base">총 캡처</CardTitle>
              <CardDescription>전체 캡처된 웹사이트</CardDescription>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MonitorSmartphone className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCaptures}</div>
            <p className="text-xs text-muted-foreground mt-1">
              활성 캡처: {stats.activeCaptures}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base">스크린샷</CardTitle>
              <CardDescription>생성된 모든 스크린샷</CardDescription>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScreenshots}</div>
            <p className="text-xs text-muted-foreground mt-1">
              캡처당 평균: {stats.averageScreenshotsPerCapture}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base">웹사이트</CardTitle>
              <CardDescription>관리 중인 웹사이트</CardDescription>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWebsites}</div>
            <p className="text-xs text-muted-foreground mt-1">
              태그 수: {stats.totalTags}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity and Recent Captures */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Activity Chart */}
        <Tabs defaultValue="week" className="md:col-span-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">활동</h2>
            <TabsList>
              <TabsTrigger value="week">주</TabsTrigger>
              <TabsTrigger value="month">월</TabsTrigger>
              <TabsTrigger value="year">년</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="week" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">지난 7일 통계</CardTitle>
                <CardDescription>
                  캡처 및 스크린샷 활동
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Placeholder for the chart */}
                <div className="h-[200px] p-6 flex flex-col space-y-2">
                  <div className="grid grid-cols-7 h-full gap-2">
                    {chartData.map((item, i) => (
                      <div key={i} className="flex flex-col h-full justify-end space-y-1">
                        <div 
                          className="bg-primary/90 rounded-t-sm w-full"
                          style={{ height: `${(item.captures / 3) * 100}%` }}
                        />
                        <div 
                          className="bg-primary/30 rounded-t-sm w-full"
                          style={{ height: `${(item.screenshots / 15) * 50}%` }}
                        />
                        <div className="text-xs text-center text-muted-foreground">
                          {item.date}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary/90 mr-1" />
                      <span>캡처</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary/30 mr-1" />
                      <span>스크린샷</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="month">
            {/* Month tab content would be similar */}
            <Card>
              <CardHeader>
                <CardTitle>월별 차트</CardTitle>
                <CardDescription>
                  월별 데이터는 로드되지 않았습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  데이터가 준비중입니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="year">
            {/* Year tab content would be similar */}
            <Card>
              <CardHeader>
                <CardTitle>연간 차트</CardTitle>
                <CardDescription>
                  연간 데이터는 로드되지 않았습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  데이터가 준비중입니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Recent Captures */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-base">최근 캡처</CardTitle>
                <CardDescription>
                  최근 캡처된 웹사이트
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="h-8">
                <Link href="/captures">
                  모두 보기
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-1">
            <div className="space-y-4">
              {recentCaptures.map(capture => (
                <div key={capture.id} className="flex justify-between items-start border-b pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Globe className="h-3 w-3 mr-1.5 text-muted-foreground" />
                      <p className="font-medium text-sm line-clamp-1">{capture.name}</p>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ExternalLink className="h-3 w-3 mr-1.5" />
                      <span>{capture.domain}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1.5" />
                      <span>{capture.createdAt}</span>
                    </div>
                    
                    {capture.status === "in_progress" && (
                      <div className="w-full pt-1">
                        <div className="flex justify-between text-xs">
                          <span>진행 중</span>
                          <span>{capture.progress}%</span>
                        </div>
                        <Progress value={capture.progress} className="h-1.5 mt-1" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge
                      variant={capture.status === "completed" ? "outline" : "secondary"}
                      className={`text-xs ${
                        capture.status === "completed" ? "bg-green-50 text-green-700 border-green-200" : ""
                      }`}
                    >
                      {capture.status === "completed" ? "완료" : "진행 중"}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-2">
                      {capture.pageCount}개 페이지
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-center">
            <Button className="w-full" asChild>
              <Link href="/captures/new">
                <Plus className="h-4 w-4 mr-2" />
                새 캡처 시작하기
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Popular tags and Menu Structure */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Popular tags */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-base">인기 태그</CardTitle>
                <CardDescription>
                  자주 사용되는 태그
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="h-8">
                <Link href="/tags">
                  태그 관리
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularTags.map(tag => (
                <div key={tag.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="font-medium text-sm">{tag.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="secondary" className="text-xs">
                      {tag.count}개 웹사이트
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/tags">
                <TagIcon className="h-4 w-4 mr-2" />
                모든 태그 보기
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Menu Structure Analysis */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-base">메뉴 구조 분석</CardTitle>
                <CardDescription>
                  웹사이트 메뉴 구조 분석 결과
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="h-8">
                <Link href="/menu-analysis">
                  분석 보기
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
              <Layers className="h-12 w-12 text-muted-foreground/40" />
              <div className="text-center">
                <h3 className="text-lg font-medium">메뉴 분석 기능 준비중</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  곧 출시될 예정입니다. AI 기반 메뉴 구조 분석 기능을 기대해주세요.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="outline" className="w-full" disabled>
              <Layers className="h-4 w-4 mr-2" />
              메뉴 구조 분석 시작하기
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}