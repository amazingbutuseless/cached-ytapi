import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/{type}/{id}',
        cors: true,
        private: true,
        request: {
          parameters: {
            paths: {
              type: true,
              id: true,
            },
          },
        },
      },
    },
  ],
};
