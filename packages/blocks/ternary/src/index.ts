import { createBlock } from '@openops/blocks-framework';
// import { ternaryAuth } from '@openops/common';
import { ternaryAuth, ternaryCloudAuth } from './auth';

export const ternary = createBlock({
  displayName: 'Ternary',
  description: 'FinOps multi-cloud platform analytics.',
  auth: ternaryCloudAuth,
  minimumSupportedRelease: '0.20.0',
  logoUrl:
    'https://firebasestorage.googleapis.com/v0/b/quilops-712fd.firebasestorage.app/o/public%2Fternary-logo.png?alt=media&token=20820a50-f4ae-4385-942b-bb58cb7cb5cf',
  categories: [],
  authors: ['Quilyx'],
  actions: [],
  triggers: [],
});
