import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TesterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard?tab=tester');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
}
