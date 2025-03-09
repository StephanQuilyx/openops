import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@openops/components/ui';
import { t } from 'i18next';
import { ChevronDown, Folder as FolderIcon } from 'lucide-react';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { useBuilderStateContext } from '@/app/features/builder/builder-hooks';
import { foldersHooks } from '@/app/features/folders/lib/folders-hooks';
import { FlowVersionState, UNCATEGORIZED_FOLDER_ID } from '@openops/shared';
import { FlowActionMenu } from './flow-actions-menu';

type Props = {
  wrapNavItems?: boolean;
};

const FlowDetailsPanel = ({ wrapNavItems }: Props) => {
  const navigate = useNavigate();

  const [flow, flowVersion, renameFlowClientSide, moveToFolderClientSide] =
    useBuilderStateContext((state) => [
      state.flow,
      state.flowVersion,
      state.renameFlowClientSide,
      state.moveToFolderClientSide,
    ]);

  const isLatestVersion =
    flowVersion.state === FlowVersionState.DRAFT ||
    flowVersion.id === flow.publishedVersionId;

  const { data: folderData } = foldersHooks.useFolder(
    flow.folderId ?? UNCATEGORIZED_FOLDER_ID,
  );

  const folderName = folderData?.displayName ?? t('Uncategorized');

  return (
    <div className="flex items-center w-full overlfow-hidden">
      <div
        className={cn('flex items-center gap-1 whitespace-nowrap', {
          'flex-wrap': wrapNavItems,
          'min-w-0': wrapNavItems,
        })}
      >
        <Tooltip>
          <TooltipTrigger
            onClick={() =>
              navigate({
                pathname: '/flows',
                search: createSearchParams({
                  folderId: folderData?.id ?? UNCATEGORIZED_FOLDER_ID,
                }).toString(),
              })
            }
            className="flex items-center gap-1 min-w-0"
          >
            <FolderIcon className="h-4 w-4 flex-shrink-0" />
            <div
              className={cn('max-w-36 truncate', {
                'max-w-64': wrapNavItems,
              })}
            >
              {folderData?.displayName ?? t('Uncategorized')}
              <span>{' / '}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {t('Go to folder: ')} {folderName}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger className="min-w-0">
            <div
              className={cn('font-bold max-w-72 truncate', {
                'max-w-64': wrapNavItems,
              })}
            >
              {flowVersion.displayName}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {flowVersion.displayName}
          </TooltipContent>
        </Tooltip>
      </div>
      <FlowActionMenu
        flow={flow}
        flowVersion={flowVersion}
        insideBuilder={true}
        readonly={!isLatestVersion}
        onDelete={() => {
          navigate('/flows');
        }}
        onRename={(newName) => renameFlowClientSide(newName)}
        onMoveTo={(folderId) => moveToFolderClientSide(folderId)}
        onDuplicate={() => {}}
      >
        <ChevronDown className="h-8 w-8 flex-shrink-0" />
      </FlowActionMenu>
    </div>
  );
};

FlowDetailsPanel.displayName = 'FlowDetailsPanel';

export { FlowDetailsPanel };
