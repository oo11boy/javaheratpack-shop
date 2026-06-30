'use client';

import { SWRConfig } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`خطا: ${res.status}`);
  return res.json();
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000,
        refreshInterval: 0,
        errorRetryCount: 2,
        revalidateIfStale: false,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}