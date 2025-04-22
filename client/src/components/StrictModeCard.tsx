import { FC, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const strictModeSchema = z.object({
  duration: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type StrictModeFormValues = z.infer<typeof strictModeSchema>;

const StrictModeCard: FC = () => {
  const [enabled, setEnabled] = useState(false);
  const { toast } = useToast();

  const form = useForm<StrictModeFormValues>({
    resolver: zodResolver(strictModeSchema),
    defaultValues: {
      duration: '7',
      password: '',
      confirmPassword: ''
    }
  });

  const enableStrictModeMutation = useMutation({
    mutationFn: async (data: StrictModeFormValues) => {
      return apiRequest('POST', `/api/strict-mode/1`, {
        password: data.password,
        duration: data.duration
      });
    },
    onSuccess: () => {
      toast({
        title: "Strict Mode Enabled",
        description: "Protection settings are now locked and can't be disabled without password.",
        variant: "default"
      });
      setEnabled(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to enable strict mode. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: StrictModeFormValues) => {
    enableStrictModeMutation.mutate(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200">
        <h2 className="font-bold text-lg text-slate-800">Strict Mode Settings</h2>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 mr-4">
              <i className="fas fa-lock"></i>
            </div>
            <div>
              <h3 className="font-medium text-slate-800">{enabled ? "Strict Mode Active" : "Strict Mode"}</h3>
              <p className="text-sm text-slate-500">Protection can't be disabled without password</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Duration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="0">Until manually disabled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="block text-sm font-medium text-slate-700 mb-1">Set Strict Mode Password</FormLabel>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          className="flex-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm password"
                          className="flex-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Use a strong password you won't easily remember</p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary-600 hover:bg-primary-700"
              disabled={enableStrictModeMutation.isPending}
            >
              <i className="fas fa-lock mr-2"></i> 
              {enabled ? "Update Strict Mode" : "Enable Strict Mode"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StrictModeCard;
