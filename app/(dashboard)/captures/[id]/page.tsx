import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type Props = {
  params: {
    id: string;
  };
};

export default async function CapturePage({ params }: Props) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    notFound();
  }
  
  // 여기서 API를 통해 캡처 데이터를 가져오는 로직을 구현합니다.
  // 지금은 목업 데이터로 UI를 구현합니다.
  const captureData = {
    id: id,
    url: 'https://example.com',
    status: 'completed',
    progress: 100,
    createdAt: new Date().toISOString(),
    website: {
      id: 1,
      name: 'Example Website',
      domain: 'example.com',
      url: 'https://example.com',
    },
    pages: [
      {
        id: 1,
        url: 'https://example.com',
        title: '예제 페이지',
      }
    ],
    pageCount: 1,
    completedPageCount: 1,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">캡처 상세</h1>
        <Badge variant={captureData.status === 'completed' ? 'success' : 'secondary'}>
          {captureData.status === 'completed' ? '완료됨' : '진행중'}
        </Badge>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{captureData.website.name}</CardTitle>
          <CardDescription>{captureData.url}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>진행 상태:</span>
              <span>{captureData.completedPageCount} / {captureData.pageCount} 페이지</span>
            </div>
            <Progress value={captureData.progress} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>생성 일시: {new Date(captureData.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="pages">
        <TabsList>
          <TabsTrigger value="pages">페이지</TabsTrigger>
          <TabsTrigger value="screenshots">스크린샷</TabsTrigger>
          <TabsTrigger value="analysis">분석 결과</TabsTrigger>
        </TabsList>
        <TabsContent value="pages" className="space-y-4 mt-4">
          {captureData.pages.map(page => (
            <Card key={page.id}>
              <CardHeader>
                <CardTitle>{page.title}</CardTitle>
                <CardDescription>{page.url}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>페이지 상세 정보가 여기에 표시됩니다.</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="screenshots" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p>스크린샷 정보가 여기에 표시됩니다.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analysis" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p>AI 분석 결과가 여기에 표시됩니다.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}