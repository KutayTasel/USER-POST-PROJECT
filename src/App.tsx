import type { JSX, ReactElement } from 'react';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { LoadingProvider } from '@/context/LoadingProvider';
import { useLoading } from '@/context/useLoading';
import { Loader } from '@/components/common/Loader';
import { bindLoading } from '@/services/api';
import { router } from '@/routes/Routes';

function LoadingBinder(): ReactElement | null {
  const loading = useLoading();
  useEffect(() => {
    bindLoading(loading);
  }, [loading]);
  return null;
}

export default function App(): JSX.Element {
  return (
    <LoadingProvider>
      <LoadingBinder />
      <RouterProvider router={router} />
      <Loader />
    </LoadingProvider>
  );
}
