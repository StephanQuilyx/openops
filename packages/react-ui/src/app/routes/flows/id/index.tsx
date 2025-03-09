import { LoadingSpinner } from '@openops/components/ui';
import { PopulatedFlow } from '@openops/shared';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';

import { SEARCH_PARAMS } from '@/app/constants/search-params';
import { BuilderPage } from '@/app/features/builder';
import { BuilderStateProvider } from '@/app/features/builder/builder-state-provider';
import { flowsApi } from '@/app/features/flows/lib/flows-api';

const FlowBuilderPage = () => {
  const { flowId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const viewOnly = new URLSearchParams(window.location.search).get(
      SEARCH_PARAMS.viewOnly,
    );

    if (viewOnly !== 'true' && viewOnly !== 'false') {
      setSearchParams({ viewOnly: 'true' });
    }
  }, [setSearchParams]);

  const {
    data: flow,
    isLoading,
    isError,
  } = useQuery<PopulatedFlow, Error>({
    queryKey: ['flow', flowId],
    queryFn: () => flowsApi.get(flowId!),
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return <Navigate to="/404" />;
  }

  if (isLoading) {
    return (
      <div className="bg-background flex h-screen w-screen items-center justify-center ">
        <LoadingSpinner size={50}></LoadingSpinner>
      </div>
    );
  }

  return (
    <BuilderStateProvider
      flow={flow!}
      canExitRun={true}
      flowVersion={flow!.version}
      readonly={searchParams.get(SEARCH_PARAMS.viewOnly) === 'true'}
      run={null}
    >
      <BuilderPage />
    </BuilderStateProvider>
  );
};

export { FlowBuilderPage };
