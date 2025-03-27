"use client"

import Link from "next/link"
import { 
  Clock, 
  ExternalLink, 
  Globe, 
  Laptop, 
  LayoutList, 
  MonitorSmartphone, 
  Phone, 
  Plus, 
  SearchIcon, 
  TrendingUp 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CapturesPage() {
  // Mock captures data
  const captures = [
    {
      id: 1,
      url: "https://example.com",
      domain: "example.com",
      name: "Example Website",
      status: "completed",
      createdAt: "2025년 3월 27일",
      screenshotCount: 6,
      pageCount: 3,
      deviceTypes: ["desktop", "tablet", "mobile"],
      progress: 100,
      tags: ["포트폴리오", "기업"]
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
      deviceTypes: ["desktop", "mobile"],
      progress: 60,
      tags: ["블로그"]
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
      deviceTypes: ["desktop", "tablet", "mobile"],
      progress: 100,
      tags: ["이커머스"]
    },
    {
      id: 4,
      url: "https://news.example.com",
      domain: "news.example.com",
      name: "Example News",
      status: "completed",
      createdAt: "2025년 3월 22일",
      screenshotCount: 8,
      pageCount: 4,
      deviceTypes: ["desktop", "tablet", "mobile"],
      progress: 100,
      tags: ["뉴스"]
    },
    {
      id: 5,
      url: "https://app.example.com",
      domain: "app.example.com",
      name: "Example Web App",
      status: "completed",
      createdAt: "2025년 3월 20일",
      screenshotCount: 10,
      pageCount: 6,
      deviceTypes: ["desktop", "mobile"],
      progress: 100,
      tags: ["웹앱", "기업"]
    }
  ]
  
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "desktop":
        return <Laptop className="h-3 w-3" />
      case "tablet":
        return <MonitorSmartphone className="h-3 w-3" />
      case "mobile":
        return <Phone className="h-3 w-3" />
      default:
        return null
    }
  }
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">캡처</h1>
        <p className="text-muted-foreground">
          웹사이트 캡처 목록을 관리하고 새로운 캡처를 시작하세요.
        </p>
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="웹사이트 이름 또는 URL 검색..."
            className="w-full pl-8"
          />
        </div>
        <Button asChild>
          <Link href="/captures/new">
            <Plus className="mr-2 h-4 w-4" />
            새 캡처
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">전체 ({captures.length})</TabsTrigger>
            <TabsTrigger value="in_progress">진행 중 ({captures.filter(c => c.status === "in_progress").length})</TabsTrigger>
            <TabsTrigger value="completed">완료 ({captures.filter(c => c.status === "completed").length})</TabsTrigger>
          </TabsList>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <LayoutList className="h-4 w-4" />
              <span>리스트</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>최근 순</span>
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {captures.map(capture => (
              <Card key={capture.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{capture.name}</CardTitle>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Globe className="mr-1 h-3 w-3" />
                        <span>{capture.domain}</span>
                      </div>
                    </div>
                    <Badge
                      variant={capture.status === "completed" ? "outline" : "secondary"}
                      className={`text-xs ${
                        capture.status === "completed" ? "bg-green-50 text-green-700 border-green-200" : ""
                      }`}
                    >
                      {capture.status === "completed" ? "완료" : "진행 중"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  {capture.status === "in_progress" && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs">
                        <span>진행 중</span>
                        <span>{capture.progress}%</span>
                      </div>
                      <Progress value={capture.progress} className="h-1.5 mt-1" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-muted-foreground">캡처 날짜</div>
                    <div className="text-right">{capture.createdAt}</div>
                    <div className="text-muted-foreground">페이지</div>
                    <div className="text-right">{capture.pageCount}개</div>
                    <div className="text-muted-foreground">스크린샷</div>
                    <div className="text-right">{capture.screenshotCount}개</div>
                    <div className="text-muted-foreground">디바이스</div>
                    <div className="flex items-center gap-1 justify-end">
                      {capture.deviceTypes.map(deviceType => (
                        <div key={deviceType}>{getDeviceIcon(deviceType)}</div>
                      ))}
                    </div>
                  </div>
                  {capture.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {capture.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-3 flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/captures/${capture.id}`}>
                      상세보기
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={capture.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      웹사이트 방문
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="in_progress" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {captures
              .filter(capture => capture.status === "in_progress")
              .map(capture => (
                <Card key={capture.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{capture.name}</CardTitle>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Globe className="mr-1 h-3 w-3" />
                          <span>{capture.domain}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        진행 중
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="mb-3">
                      <div className="flex justify-between text-xs">
                        <span>진행 중</span>
                        <span>{capture.progress}%</span>
                      </div>
                      <Progress value={capture.progress} className="h-1.5 mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-muted-foreground">캡처 날짜</div>
                      <div className="text-right">{capture.createdAt}</div>
                      <div className="text-muted-foreground">페이지</div>
                      <div className="text-right">{capture.pageCount}개</div>
                      <div className="text-muted-foreground">스크린샷</div>
                      <div className="text-right">{capture.screenshotCount}개</div>
                      <div className="text-muted-foreground">디바이스</div>
                      <div className="flex items-center gap-1 justify-end">
                        {capture.deviceTypes.map(deviceType => (
                          <div key={deviceType}>{getDeviceIcon(deviceType)}</div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/captures/${capture.id}`}>
                        상세보기
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={capture.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        웹사이트 방문
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {captures
              .filter(capture => capture.status === "completed")
              .map(capture => (
                <Card key={capture.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{capture.name}</CardTitle>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Globe className="mr-1 h-3 w-3" />
                          <span>{capture.domain}</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200"
                      >
                        완료
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-muted-foreground">캡처 날짜</div>
                      <div className="text-right">{capture.createdAt}</div>
                      <div className="text-muted-foreground">페이지</div>
                      <div className="text-right">{capture.pageCount}개</div>
                      <div className="text-muted-foreground">스크린샷</div>
                      <div className="text-right">{capture.screenshotCount}개</div>
                      <div className="text-muted-foreground">디바이스</div>
                      <div className="flex items-center gap-1 justify-end">
                        {capture.deviceTypes.map(deviceType => (
                          <div key={deviceType}>{getDeviceIcon(deviceType)}</div>
                        ))}
                      </div>
                    </div>
                    {capture.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {capture.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/captures/${capture.id}`}>
                        상세보기
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={capture.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        웹사이트 방문
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}