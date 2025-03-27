import {
  AuthenticationType,
  // HttpMessageBody,
  HttpMethod,
  HttpRequest,
  // QueryParams,
  httpClient,
} from '@openops/blocks-common';
import { ternaryAuth } from '../../auth';

export async function sendTernaryRequest(
  request: HttpRequest & { auth: ternaryAuth },
) {
  return httpClient.sendRequest({
    ...request,
    url: `${request.auth.apiURL}/api/${request.url}`,
    method: HttpMethod.GET,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: request.auth.apiKey,
    },
  });
}
