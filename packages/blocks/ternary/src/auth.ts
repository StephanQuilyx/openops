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
      defaultValue:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDI5ODQ3MDIsImV4cCI6MTc5ODc1ODAwMCwiYXVkIjoiYXBpLmV1LnRlcm5hcnkuYXBwIiwiaXNzIjoiYXBpLmV1LnRlcm5hcnkuYXBwIiwic3ViIjoiMGJlMTY4NjgtZmQyMS00NjBlLWFmMWItYWQ4YjU0MmQ3OGY5IiwianRpIjoiMGZjNGFmMDAtMWIzMi00MGNmLTllYzQtOGRmMDBlZWQ3OWRhIn0.D9qHJXx0JHzcNWYKi1yezdzH_Tbl-V-QJabEKAqsqAY',
      required: true,
    }),
    tenantId: Property.ShortText({
      displayName: 'Tenant ID',
      defaultValue: '02cf5d96-6444-4c9c-8cab-a98d20d40b5d',
      required: true,
    }),
    apiURL: Property.ShortText({
      displayName: 'API URL',
      defaultValue: 'https://core-api.eu.ternary.app',
      description: 'For example: https://core-api.eu.ternary.app',
      required: true,
      validators: [Validators.url],
    }),
  },
  validate: async ({ auth }) => {
    try {
      await sendTernaryRequest({
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
