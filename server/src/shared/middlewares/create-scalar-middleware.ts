import type { RequestHandler } from 'express';
import { apiReference } from '@scalar/express-api-reference';

function createScalarMiddleware(): RequestHandler {
  return apiReference({
    sources: [
      { title: 'Github Wiki', url: '/openapi.yml', default: true },
      { title: 'Auth (Better Auth)', url: '/api/auth/open-api/generate-schema' },
    ],
    layout: 'modern',
    darkMode: true,
    persistAuth: true,
    searchHotKey: 'k',
    defaultHttpClient: {
      targetKey: 'node',
      clientKey: 'fetch',
    },
    metaData: {
      title: 'Scalar API Docs Example',
      description: 'Companion project for the Medium article on Scalar API documentation.',
    },
  } as never) as RequestHandler;
}

export {createScalarMiddleware}