/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { BlockAuth, Property } from '@openops/blocks-framework';

export interface TernaryCredentials {
  apiKey: string;
  tenantId: string;
  apiURL?: string;
}

export interface TernaryAuth {
  apiKey: string;
}

// export async function getCredentialsFromAuth(
//   auth: any,
// ): Promise<TernaryCredentials> {
//   return {
//     apiKey: auth.apiKey,
//     tenantId: auth.tenantId,
//   };
// }

export const ternaryAuth = BlockAuth.CustomAuth({
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
      required: true,
    }),
  },
  required: true,
});
// test
export function isTernaryAuth(obj: any): obj is TernaryAuth {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    Object.prototype.hasOwnProperty.call(obj, 'apiKey') &&
    typeof obj.apiKey === 'string' &&
    Object.prototype.hasOwnProperty.call(obj, 'tenantId') &&
    typeof obj.tenantId === 'string' &&
    Object.prototype.hasOwnProperty.call(obj, 'apiURL') &&
    typeof obj.apiURL === 'string'
  );
}
