import {
  FastifyPluginCallbackTypebox,
  Type,
} from '@fastify/type-provider-typebox';
import {
  EndpointScope,
  PrincipalType,
  Project,
  UpdateProjectRequestInCommunity,
} from '@openops/shared';
import { StatusCodes } from 'http-status-codes';
import { paginationHelper } from '../helper/pagination/pagination-utils';
import { projectService } from './project-service';

export const userProjectController: FastifyPluginCallbackTypebox = (
  fastify,
  _opts,
  done,
) => {
  fastify.get('/:id', async (request) => {
    return projectService.getOneOrThrow(request.principal.projectId);
  });

  fastify.get('/', async (request) => {
    return paginationHelper.createPage(
      [await projectService.getOneOrThrow(request.principal.projectId)],
      null,
    );
  });
  done();
};

export const projectController: FastifyPluginCallbackTypebox = (
  fastify,
  _opts,
  done,
) => {
  fastify.post('/:id', UpdateProjectRequest, async (request) => {
    return projectService.update(request.params.id, request.body);
  });
  done();
};

const UpdateProjectRequest = {
  config: {
    allowedPrincipals: [PrincipalType.USER, PrincipalType.SERVICE],
    scope: EndpointScope.ORGANIZATION,
  },
  schema: {
    tags: ['projects'],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      [StatusCodes.OK]: Project,
    },
    body: UpdateProjectRequestInCommunity,
  },
};
