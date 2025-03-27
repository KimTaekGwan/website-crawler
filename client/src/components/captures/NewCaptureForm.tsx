import { useState, useId } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DeviceProfile } from '@shared/schema';

// Form schema
const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
  deviceTypes: z.array(z.string()).min(1, { message: 'Select at least one device type' }),
  initialTags: z.string().optional(),
  captureFullPage: z.boolean().default(true),
  captureDynamicElements: z.boolean().default(false),
  customDevice: z.boolean().default(false),
  customDeviceName: z.string().optional(),
  customDeviceWidth: z.number().positive().optional(),
  customDeviceHeight: z.number().positive().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewCaptureForm() {
  const { toast } = useToast();
  const checkboxId = useId();
  const [showCustomDevice, setShowCustomDevice] = useState(false);

  // Get default device profiles
  const { data: deviceProfiles } = useQuery<DeviceProfile[]>({
    queryKey: ['/api/device-profiles/default']
  });

  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      deviceTypes: ['desktop', 'tablet', 'mobile'],
      initialTags: '',
      captureFullPage: true,
      captureDynamicElements: false,
      customDevice: false,
      customDeviceName: '',
      customDeviceWidth: 1280,
      customDeviceHeight: 720,
    }
  });

  // Watch for custom device changes
  const watchCustomDevice = form.watch('customDevice');
  if (watchCustomDevice !== showCustomDevice) {
    setShowCustomDevice(watchCustomDevice);
  }

  // Start capture mutation
  const startCaptureMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/captures', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/captures'] });
      toast({
        title: 'Capture started',
        description: 'The capture process has been started.'
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Form submission
  const onSubmit = (data: FormValues) => {
    let deviceTypes = [...data.deviceTypes];
    
    // Add custom device if enabled
    if (data.customDevice && data.customDeviceName && data.customDeviceWidth && data.customDeviceHeight) {
      deviceTypes.push(data.customDeviceName.toLowerCase().replace(/\s+/g, '-'));
    }

    // Parse tags
    const initialTags = data.initialTags
      ? data.initialTags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    // Prepare payload
    const payload = {
      url: data.url,
      deviceTypes,
      captureFullPage: data.captureFullPage,
      captureDynamicElements: data.captureDynamicElements,
      initialTags,
      customSizes: data.customDevice && data.customDeviceName ? [{
        name: data.customDeviceName.toLowerCase().replace(/\s+/g, '-'),
        width: data.customDeviceWidth,
        height: data.customDeviceHeight
      }] : undefined
    };

    startCaptureMutation.mutate(payload);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg" id="new-capture">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">New Capture</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Capture screenshots for multiple device sizes</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="sm:col-span-4">
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          https://
                        </span>
                        <Input
                          {...field}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary focus:border-primary sm:text-sm border-gray-300"
                          placeholder="example.com"
                          value={field.value.replace(/^https?:\/\//i, '')}
                          onChange={(e) => field.onChange(`https://${e.target.value}`)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initialTags"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Initial Tags</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g. reference, e-commerce"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-6">
                <fieldset>
                  <legend className="text-sm font-medium text-gray-700">Device Types</legend>
                  <div className="mt-2 space-y-2 sm:space-y-0 sm:flex sm:space-x-5">
                    {['desktop', 'tablet', 'mobile'].map((device) => (
                      <div key={device} className="flex items-center">
                        <FormField
                          control={form.control}
                          name="deviceTypes"
                          render={({ field }) => (
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Checkbox
                                  id={`${checkboxId}-${device}`}
                                  checked={field.value?.includes(device)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, device]);
                                    } else {
                                      field.onChange(current.filter(val => val !== device));
                                    }
                                  }}
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                              </FormControl>
                              <label htmlFor={`${checkboxId}-${device}`} className="ml-2 block text-sm text-gray-700 capitalize">
                                {device} {deviceProfiles && deviceProfiles.find(p => p.name.toLowerCase() === device)
                                  ? `(${deviceProfiles.find(p => p.name.toLowerCase() === device)?.width}×${deviceProfiles.find(p => p.name.toLowerCase() === device)?.height})`
                                  : ''}
                              </label>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    <div className="flex items-center">
                      <FormField
                        control={form.control}
                        name="customDevice"
                        render={({ field }) => (
                          <FormItem className="flex items-center">
                            <FormControl>
                              <Checkbox
                                id={`${checkboxId}-custom`}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                              />
                            </FormControl>
                            <label htmlFor={`${checkboxId}-custom`} className="ml-2 block text-sm text-gray-700">
                              Custom
                            </label>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              {showCustomDevice && (
                <div className="sm:col-span-6">
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="customDeviceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-xs font-medium text-gray-700">Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="custom-device-name"
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                              placeholder="Custom device"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customDeviceWidth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-xs font-medium text-gray-700">Width (px)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="custom-device-width"
                              type="number"
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                              placeholder="Width"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customDeviceHeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-xs font-medium text-gray-700">Height (px)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="custom-device-height"
                              type="number"
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                              placeholder="Height"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="captureFullPage"
                  render={({ field }) => (
                    <FormItem className="flex items-start">
                      <FormControl>
                        <Checkbox
                          id="capture-full-page"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </FormControl>
                      <div className="ml-3 text-sm">
                        <label htmlFor="capture-full-page" className="font-medium text-gray-700">Capture Full Page</label>
                        <p className="text-gray-500">Take scrolling screenshot of entire page content</p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="captureDynamicElements"
                  render={({ field }) => (
                    <FormItem className="flex items-start">
                      <FormControl>
                        <Checkbox
                          id="capture-dynamic-elements"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </FormControl>
                      <div className="ml-3 text-sm">
                        <label htmlFor="capture-dynamic-elements" className="font-medium text-gray-700">Include Dynamic Elements</label>
                        <p className="text-gray-500">Wait for dynamic content to load before capture</p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-5 flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={startCaptureMutation.isPending}
              >
                {startCaptureMutation.isPending ? 'Starting...' : 'Start Capture'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
