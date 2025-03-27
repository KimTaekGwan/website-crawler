"use client"

import Link from "next/link"
import { 
  CalendarDays, 
  Check, 
  ChevronDown, 
  Globe, 
  Plus, 
  SearchIcon, 
  Settings, 
  Trash2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TagsPage() {
  // Mock tags data
  const tags = [
    { 
      id: 1, 
      name: "포트폴리오", 
      color: "#3B82F6", 
      websiteCount: 8,
      createdAt: "2025년 3월 15일",
      updatedAt: "2025년 3월 27일"
    },
    { 
      id: 2, 
      name: "블로그", 
      color: "#10B981", 
      websiteCount: 5,
      createdAt: "2025년 3월 16일",
      updatedAt: "2025년 3월 26일"
    },
    { 
      id: 3, 
      name: "기업", 
      color: "#6366F1", 
      websiteCount: 12,
      createdAt: "2025년 3월 17일",
      updatedAt: "2025년 3월 25일"
    },
    { 
      id: 4, 
      name: "이커머스", 
      color: "#EC4899", 
      websiteCount: 6,
      createdAt: "2025년 3월 18일",
      updatedAt: "2025년 3월 24일"
    },
    { 
      id: 5, 
      name: "뉴스", 
      color: "#F59E0B", 
      websiteCount: 4,
      createdAt: "2025년 3월 19일",
      updatedAt: "2025년 3월 23일"
    },
    { 
      id: 6, 
      name: "웹앱", 
      color: "#8B5CF6", 
      websiteCount: 3,
      createdAt: "2025년 3월 20일",
      updatedAt: "2025년 3월 22일"
    },
    { 
      id: 7, 
      name: "디자인", 
      color: "#EF4444", 
      websiteCount: 7,
      createdAt: "2025년 3월 21일",
      updatedAt: "2025년 3월 21일"
    }
  ]
  
  // Mock websites data for each tag
  const websitesForTag = [
    { id: 1, name: "Company Site", domain: "company.example.com", url: "https://company.example.com", screenshotCount: 12 },
    { id: 2, name: "Portfolio", domain: "portfolio.example.com", url: "https://portfolio.example.com", screenshotCount: 8 },
    { id: 3, name: "Blog", domain: "blog.example.com", url: "https://blog.example.com", screenshotCount: 5 }
  ]
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">태그</h1>
        <p className="text-muted-foreground">
          웹사이트 분류를 위한 태그를 관리하고 새로운 태그를 만드세요.
        </p>
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="태그 검색..."
            className="w-full pl-8"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              새 태그 만들기
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 태그 만들기</DialogTitle>
              <DialogDescription>
                웹사이트를 분류하기 위한 새로운 태그를 만드세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  태그 이름
                </label>
                <Input
                  id="name"
                  placeholder="태그 이름을 입력하세요"
                  className="col-span-3"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="color" className="text-sm font-medium">
                  태그 색상
                </label>
                <div className="flex gap-2">
                  {["#3B82F6", "#10B981", "#6366F1", "#EC4899", "#F59E0B", "#8B5CF6", "#EF4444"].map(color => (
                    <button
                      key={color}
                      className="h-8 w-8 rounded-full border flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      <Check className="h-4 w-4 text-white" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button type="submit">생성하기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-1">
          <CardTitle>태그 목록</CardTitle>
          <CardDescription>
            웹사이트 분류를 위해 만든 태그 목록입니다. 총 {tags.length}개의 태그가 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">태그 이름</TableHead>
                <TableHead>웹사이트 수</TableHead>
                <TableHead>생성 날짜</TableHead>
                <TableHead>수정 날짜</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map(tag => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </TableCell>
                  <TableCell>{tag.websiteCount}개</TableCell>
                  <TableCell className="text-muted-foreground">{tag.createdAt}</TableCell>
                  <TableCell className="text-muted-foreground">{tag.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 mr-2">
                          <Globe className="h-3.5 w-3.5 mr-1" />
                          웹사이트 보기
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: tag.color }}
                              />
                              <span>{tag.name} 태그가 적용된 웹사이트</span>
                            </div>
                          </DialogTitle>
                          <DialogDescription>
                            이 태그가 적용된 웹사이트 목록입니다. 총 {tag.websiteCount}개의 웹사이트가 있습니다.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-3">
                          {websitesForTag.map(website => (
                            <div key={website.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                              <div className="space-y-1">
                                <div className="font-medium">{website.name}</div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Globe className="mr-1 h-3 w-3" />
                                  <span>{website.domain}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {website.screenshotCount}개의 스크린샷
                                </Badge>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={website.url} target="_blank" rel="noopener noreferrer">
                                    방문
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">닫기</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>태그 편집</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>태그 삭제</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t pt-6 pb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <div>총 {tags.length}개의 태그가 있습니다.</div>
          </div>
        </CardFooter>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tags
          .sort((a, b) => b.websiteCount - a.websiteCount)
          .slice(0, 3)
          .map(tag => (
            <Card key={tag.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <CardTitle className="text-lg">{tag.name}</CardTitle>
                  </div>
                  <Badge variant="outline">{tag.websiteCount}개 웹사이트</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>이 태그는 주로 다음과 같은 웹사이트에 적용되었습니다:</p>
                  <ul className="mt-2 space-y-1">
                    {websitesForTag.slice(0, 2).map(website => (
                      <li key={website.id} className="flex items-center">
                        <ChevronDown className="h-3 w-3 mr-1 rotate-[-90deg]" />
                        {website.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="text-xs text-muted-foreground">
                  생성: {tag.createdAt}
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/tags/${tag.id}`}>
                    자세히 보기
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  )
}