import { HttpError, HttpMethod } from '@openops/blocks-common';
import { BlockAuth, Property, Validators } from '@openops/blocks-framework';
import { sendTernaryRequest } from './lib/common';

export const ternaryCloudAuth = BlockAuth.CustomAuth({
  description: `
Ternary API documentation:
https://docs.ternary.app/reference/using-the-api
    `,
  required: true,
  props: {
    apiKey: BlockAuth.SecretText({
      displayName: 'API key',
      required: true,
    }),
    tenantId: Property.ShortText({
      displayName: 'Tenant ID',
      required: true,
    }),
    apiURL: Property.ShortText({
      displayName: 'API URL',
      description: 'For example: https://core-api.eu.ternary.app',
      required: true,
      validators: [Validators.url],
    }),
  },
  validate: async ({ auth }) => {
    try {
      const response = await sendTernaryRequest({
        auth: auth,
        method: HttpMethod.GET,
        url: 'me',
      });
      return {
        valid: true,
      };
    } catch (e) {
      return {
        valid: false,
        error: ((e as HttpError).response.body as any).message,
      };
    }
  },
});

export type ternaryAuth = {
  apiKey: string;
  tenantId: string;
  apiURL: string;
};
