import { SignUp } from '@clerk/nextjs';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function SignUpPage() {
  return (
    <>
      <PublicHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
        <SignUp />
      </main>
    </>
  );
}