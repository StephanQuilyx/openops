import { HttpMethod } from '@openops/blocks-common';
import { createAction } from '@openops/blocks-framework';
import { ternaryCloudAuth } from '../../auth';
import { sendTernaryRequest } from '../common';

export const getBudgets = createAction({
  name: 'get_budgets',
  displayName: 'Get budgets',
  description: 'Fetch budgets from Ternary.',
  auth: ternaryCloudAuth,
  props: {},
  run: async ({ auth }) => {
    try {
      const response = await sendTernaryRequest({
        auth: auth,
        method: HttpMethod.GET,
        url: 'budgets',
        queryParams: {
          tenantId: auth.tenantId,
        },
      });
      return response.body as any[];
    } catch (e) {
      console.error('Error getting budgets!');
      console.error(e);
      return e;
    }
  },
});
