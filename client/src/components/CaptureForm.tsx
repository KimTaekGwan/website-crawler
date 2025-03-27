import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Globe, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { useCaptures, useUrlValidation, CaptureConfig } from '@/hooks/useCapture';

const captureFormSchema = z.object({
  url: z.string().url({ message: '유효한 URL을 입력해 주세요' }),
  deviceTypes: z.array(z.string()).min(1, { message: '최소 한 개의 디바이스를 선택해 주세요' }),
  captureFullPage: z.boolean().default(true),
  captureDynamicElements: z.boolean().default(true),
});

type CaptureFormValues = z.infer<typeof captureFormSchema>;

const defaultDeviceTypes = [
  { id: 'desktop', label: '데스크톱 (1920×1080)' },
  { id: 'tablet', label: '태블릿 (768×1024)' },
  { id: 'mobile', label: '모바일 (375×667)' },
];

export function CaptureForm() {
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);
  const { createCapture, isPending } = useCaptures();
  const { validateUrl, isValidating } = useUrlValidation();

  const form = useForm<CaptureFormValues>({
    resolver: zodResolver(captureFormSchema),
    defaultValues: {
      url: '',
      deviceTypes: ['desktop'],
      captureFullPage: true,
      captureDynamicElements: true,
    },
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url.trim() === '') {
      setIsUrlValid(null);
      return;
    }

    // URL 유효성 검증
    try {
      new URL(url);
      validateUrl(url, {
        onSuccess: (data) => {
          setIsUrlValid(data.is_valid);
        },
        onError: () => {
          setIsUrlValid(false);
        },
      });
    } catch {
      setIsUrlValid(false);
    }
  };

  const onSubmit = (data: CaptureFormValues) => {
    const captureConfig: CaptureConfig = {
      url: data.url,
      deviceTypes: data.deviceTypes,
      captureFullPage: data.captureFullPage,
      captureDynamicElements: data.captureDynamicElements,
    };

    createCapture(captureConfig);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>웹사이트 URL</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          placeholder="https://example.com"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleUrlChange(e);
                          }}
                          className={`pl-10 ${
                            isUrlValid === true
                              ? 'border-green-500'
                              : isUrlValid === false
                              ? 'border-red-500'
                              : ''
                          }`}
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                          <Globe size={18} />
                        </div>
                        {isUrlValid === true && (
                          <div className="absolute right-3 top-2.5 text-green-500">
                            <Check size={18} />
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </div>
                  <FormDescription>캡처할 웹사이트의 전체 URL을 입력하세요</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deviceTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>디바이스 유형</FormLabel>
                    <FormDescription>
                      캡처할 디바이스 유형을 선택하세요. 여러 개 선택 가능합니다.
                    </FormDescription>
                  </div>
                  <div className="space-y-2">
                    {defaultDeviceTypes.map((device) => (
                      <FormField
                        key={device.id}
                        control={form.control}
                        name="deviceTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={device.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(device.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, device.id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== device.id)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{device.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="captureFullPage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">전체 페이지 캡처</FormLabel>
                      <FormDescription>스크롤 영역까지 포함한 전체 페이지를 캡처합니다</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="captureDynamicElements"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">동적 요소 캡처</FormLabel>
                      <FormDescription>자바스크립트로 불러오는 콘텐츠를 기다립니다</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  캡처 처리 중...
                </>
              ) : (
                '캡처 시작'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}