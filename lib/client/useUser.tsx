import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

interface UserInfoResponse {
  ok: boolean;
  userInfo: User;
}

export default function useUser() {
  const { data, error } = useSWR<UserInfoResponse>(
    typeof window === 'undefined' ? null : '/api/userInfo'
  );
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace('/log-in');
    }
  }, [data, router]);
  return { user: data?.userInfo, isLoading: !data && !error };
}
