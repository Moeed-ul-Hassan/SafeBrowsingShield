import { FC, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const partnerSchema = z.object({
  email: z.string().email('Invalid email address'),
  notifyBlocked: z.boolean().default(true),
  notifySettings: z.boolean().default(true),
  weeklyReports: z.boolean().default(false)
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

const AccountabilityCard: FC = () => {
  const [partnerAdded, setPartnerAdded] = useState(false);
  const { toast } = useToast();

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      email: '',
      notifyBlocked: true,
      notifySettings: true,
      weeklyReports: false
    }
  });

  const addPartnerMutation = useMutation({
    mutationFn: async (data: PartnerFormValues) => {
      return apiRequest('POST', '/api/accountability-partners', {
        userId: 1,
        ...data
      });
    },
    onSuccess: () => {
      toast({
        title: "Accountability Partner Added",
        description: "Your partner will be notified based on your settings.",
        variant: "default"
      });
      setPartnerAdded(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add accountability partner. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: PartnerFormValues) => {
    addPartnerMutation.mutate(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200">
        <h2 className="font-bold text-lg text-slate-800">Accountability Partner</h2>
      </div>
      <div className="p-6">
        <div className="mb-5">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 mr-4">
              <i className="fas fa-user-friends"></i>
            </div>
            <div>
              <h3 className="font-medium text-slate-800">Add a trusted person</h3>
              <p className="text-sm text-slate-500">They'll be notified about block attempts</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Partner Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter email address" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="block text-sm font-medium text-slate-700 mb-1">Notification Settings</FormLabel>
              <div className="space-y-3 mt-2">
                <FormField
                  control={form.control}
                  name="notifyBlocked"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="notifyBlocked"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="notifyBlocked" className="text-sm text-slate-700">
                          Notify when blocked content is attempted
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notifySettings"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="notifySettings"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="notifySettings" className="text-sm text-slate-700">
                          Notify when settings are changed
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="weeklyReports"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="weeklyReports"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="weeklyReports" className="text-sm text-slate-700">
                          Send weekly progress reports
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-secondary-600 hover:bg-secondary-700"
              disabled={addPartnerMutation.isPending}
            >
              <i className="fas fa-user-plus mr-2"></i> 
              {partnerAdded ? "Update Partner Settings" : "Add Accountability Partner"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AccountabilityCard;
