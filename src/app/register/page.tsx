import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import RegisterForm from '@/components/auth/register-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center pb-4">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
            <CardDescription>Join Pinyin Mastery today</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter className="flex-col gap-4 pt-4">
             <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
