import { useCaptures } from '@/hooks/useCapture';
import { useWebsites } from '@/hooks/useWebsites';
import { useTags } from '@/hooks/useTags';

import { CaptureForm } from '@/components/CaptureForm';
import { CaptureResults } from '@/components/CaptureResults';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const { captures } = useCaptures();
  const { websites } = useWebsites();
  const { tags } = useTags();
  
  // 모든 캡처의 스크린샷 수 계산
  const screenshotCount = captures?.reduce((total, capture) => {
    // 각 캡처마다 페이지 수 * 디바이스 유형 수 = 스크린샷 수
    const captureScreenshots = (capture.pageCount || 0) * (capture.deviceTypes?.length || 0);
    return total + captureScreenshots;
  }, 0) || 0;

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">대시보드</h2>
          <p className="text-muted-foreground">
            WebCapture Pro 멀티 디바이스 웹 캡처 및 분석 도구
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 캡처</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{captures?.length || 0}</div>
            <p className="text-xs text-muted-foreground">전체 캡처 횟수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">스크린샷</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{screenshotCount}</div>
            <p className="text-xs text-muted-foreground">
              저장된 스크린샷 수
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">웹사이트</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{websites?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              등록된 웹사이트 수
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">태그</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags?.length || 0}</div>
            <p className="text-xs text-muted-foreground">생성된 태그 수</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="capture" className="mb-8">
        <TabsList>
          <TabsTrigger value="capture">새 캡처</TabsTrigger>
          <TabsTrigger value="results">캡처 결과</TabsTrigger>
        </TabsList>
        <TabsContent value="capture" className="space-y-4">
          <h3 className="text-xl font-semibold">새 웹사이트 캡처 만들기</h3>
          <CaptureForm />
        </TabsContent>
        <TabsContent value="results">
          <CaptureResults />
        </TabsContent>
      </Tabs>
    </div>
  );
}
