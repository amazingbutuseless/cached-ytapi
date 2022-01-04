import { youtube_v3 } from 'googleapis';
import CacheStorage from './cacheStorage';
import YoutubeClient from './youtubeClient';

const { client: yt, auth: ytAuth } = YoutubeClient;

class CacheResolver {
  protected storage: CacheStorage;
  protected cached: Record<string, unknown> = null;

  constructor(type: string, protected id: string, protected pageToken?: string) {
    this.storage = new CacheStorage(type, id, pageToken);
  }

  async getEtagIfDataCached() {
    try {
      const cache = await this.storage.get();
      const data = JSON.parse(cache?.Body as string);
      this.cached = data;
      return data.etag;
    } catch (e) {
      return null;
    }
  }

  async getDataFromApi(_etag?: string): Promise<Record<string, unknown>> {
    throw new Error('getDataFromApi must be implemented.');
  }

  async request() {
    try {
      const etag = await this.getEtagIfDataCached();
      const response = await this.getDataFromApi(etag);
      return response;
    } catch (e) {
      console.log({ e });
      return this.cached;
    }
  }
}

export class PlaylistItemCacheResolver extends CacheResolver {
  constructor(id: string, pageToken?: string) {
    super('playlist', id, pageToken);
  }

  async getDataFromApi(etag?: string): Promise<Record<string, unknown>> {
    const options: youtube_v3.Params$Resource$Playlistitems$List & { headers?: Record<string, string> } = {
      part: ['snippet', 'contentDetails'],
      maxResults: 50,
      playlistId: this.id,
      pageToken: this.pageToken,
    };

    if (etag) {
      options.headers = { 'If-None-Match': etag };
    }

    const response = await yt.playlistItems.list({ ...options, auth: ytAuth });

    if (response.status === 304) {
      return this.cached;
    }

    const data = response.data as Record<string, unknown>;

    try {
      this.storage.set(data);
    } catch (e) {
      console.log(`cannot save data of the playlist(${this.id}) to cache`);
    }

    return data;
  }
}
