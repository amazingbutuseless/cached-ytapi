import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { PlaylistItemCacheResolver } from 'src/libs/cacheResolver';

const request = async (event) => {
  const { type, id } = event.pathParameters;
  const { pageToken } = event.queryStringParameters || {};
  const { origin } = event.headers;

  try {
    let response = {};

    if (type !== 'playlist') {
      return formatJSONResponse({ message: 'Invalid request' }, 400);
    }

    const playlistResolver = new PlaylistItemCacheResolver(id, pageToken);
    response = await playlistResolver.request();
    return formatJSONResponse(response, origin);
  } catch (e) {
    return formatJSONResponse({ message: e.message }, origin, 500);
  }
};

export const main = middyfy(request);
