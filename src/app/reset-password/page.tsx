
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { verifyPasswordResetCode, confirmPasswordReset, checkActionCode } from 'firebase/auth';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const passwordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

function ResetPasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const [verificationState, setVerificationState] = useState<'verifying' | 'valid' | 'invalid'>('verifying');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setVerificationState('invalid');
        setError('No reset code provided. Please try again from the link in your email.');
        return;
      }
      try {
        const actionCodeInfo = await checkActionCode(auth, oobCode);
        setUserEmail(actionCodeInfo.data.email!);
        setVerificationState('valid');
      } catch (err) {
        setVerificationState('invalid');
        setError('The password reset link is invalid or has expired. Please request a new one.');
        console.error('Verify password reset code error:', err);
      }
    };
    verifyCode();
  }, [oobCode]);

  const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    if (verificationState !== 'valid' || !oobCode) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      await confirmPasswordReset(auth, oobCode, data.password);
      setSuccess(true);
    } catch (err) {
      setError('An error occurred while resetting your password. The link may have expired. Please try again.');
      console.error('Confirm password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationState === 'verifying') {
    return (
      <div className="w-full max-w-sm space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-24 self-end" />
        </div>
      </div>
    );
  }

  if (success) {
    return (
        <div className="w-full max-w-sm text-center space-y-6">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h1 className="text-2xl font-bold">Password Changed!</h1>
            <p>Your password has been updated successfully.</p>
            <Button asChild className="w-full">
                <Link href="/login">Go to Login</Link>
            </Button>
        </div>
    );
  }

  if (verificationState === 'invalid') {
     return (
        <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
              <h1 className="text-2xl font-bold mt-4">Invalid Link</h1>
            </div>
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
              <Button asChild className="w-full mt-6">
                <Link href="/login">Back to Login</Link>
            </Button>
        </div>
     );
  }


  return (
    <div className="w-full max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reset your password</h1>
        {userEmail && <p className="text-muted-foreground mt-2">for {userEmail}</p>}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={isPasswordVisible ? 'text' : 'password'} 
                      placeholder="Enter new password" 
                      {...field} 
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                    >
                      {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">{error}</p>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'SAVING...' : 'SAVE'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


export default function ResetPasswordPage() {
    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <Suspense fallback={
              <div className="w-full max-w-sm space-y-6 animate-pulse">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <div className="space-y-4 pt-6">
                  <Skeleton className="h-10 w-full" />
                   <div className="flex justify-end">
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>
              </div>
            }>
                <ResetPasswordComponent />
            </Suspense>
        </main>
    );
}

