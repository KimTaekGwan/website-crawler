import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ExternalLink, AlertCircle, Check } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCaptures } from '@/hooks/useCapture';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

type CaptureResultsProps = {
  limit?: number;
};

export function CaptureResults({ limit = 5 }: CaptureResultsProps) {
  const { captures, isLoading, refetch } = useCaptures();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!captures || captures.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>캡처 결과 없음</AlertTitle>
        <AlertDescription>
          아직 캡처된 웹사이트가 없습니다. 위 폼을 사용하여 첫 번째 캡처를 시작하세요.
        </AlertDescription>
      </Alert>
    );
  }

  // 최신 순으로 정렬하고 개수 제한
  const recentCaptures = [...captures]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">최근 캡처 결과</h2>
      {recentCaptures.map((capture) => {
        const isCompleted = capture.status === 'completed';
        const isError = capture.status === 'error';
        const isPending = capture.status === 'pending';
        const isProcessing = capture.status === 'processing';

        return (
          <Card key={capture.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    {capture.website?.name || '웹사이트'}
                    <Badge
                      variant={
                        isCompleted
                          ? 'success'
                          : isError
                          ? 'destructive'
                          : isProcessing
                          ? 'default'
                          : 'outline'
                      }
                      className="ml-2"
                    >
                      {isCompleted
                        ? '완료됨'
                        : isError
                        ? '오류'
                        : isProcessing
                        ? '처리 중'
                        : '대기 중'}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <span>{capture.website?.url}</span>
                    <a
                      href={capture.website?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </CardDescription>
                </div>
                <CardDescription>
                  {formatDistanceToNow(new Date(capture.createdAt), { addSuffix: true, locale: ko })}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {(isProcessing || isPending) && (
                <div className="mb-3">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>진행률</span>
                    <span>{capture.progress}%</span>
                  </div>
                  <Progress value={capture.progress} className="h-2" />
                </div>
              )}

              {isError && (
                <Alert variant="destructive" className="mb-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>캡처 실패</AlertTitle>
                  <AlertDescription>{capture.error || '캡처 중 오류가 발생했습니다'}</AlertDescription>
                </Alert>
              )}

              {isCompleted && (
                <div className="mb-3">
                  <Alert variant="success" className="border-green-200 bg-green-50 text-green-800">
                    <Check className="h-4 w-4" />
                    <AlertTitle>캡처 완료</AlertTitle>
                    <AlertDescription>
                      {capture.pageCount || 0}개 페이지 캡처 완료. 세부 정보를 확인하세요.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                {(capture.deviceTypes || []).map((device) => (
                  <Badge key={device} variant="outline">
                    {device}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/captures/${capture.id}`)}
                  disabled={isPending}
                >
                  {isCompleted ? '결과 보기' : '상세 정보'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {captures.length > limit && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={() => router.push('/captures')}>
            모든 캡처 보기 ({captures.length})
          </Button>
        </div>
      )}
    </div>
  );
}