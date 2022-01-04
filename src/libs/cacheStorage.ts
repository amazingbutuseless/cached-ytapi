import * as AWS from 'aws-sdk';

import { promisify } from 'src/libs/utils';

export default class CacheStorage {
  private client: AWS.S3 = new AWS.S3({ region: process.env.AWS_REGION });
  private fileName: string;

  constructor(type: string, id: string, pageToken?: string) {
    let fileName = `${type}/${id}`;
    if (pageToken) {
      fileName += `-${pageToken}`;
    }
    this.fileName = fileName;
  }

  get(): Promise<AWS.S3.Types.GetObjectOutput> {
    return promisify((callback) => {
      this.client.getObject(
        {
          Bucket: process.env.CACHE_BUCKET_NAME,
          Key: `${this.fileName}.json`,
        },
        callback
      );
    });
  }

  set(response: Record<string, unknown>): Promise<AWS.S3.PutObjectOutput> {
    return promisify((callback) => {
      this.client.putObject(
        {
          Bucket: process.env.CACHE_BUCKET_NAME,
          Key: `${this.fileName}.json`,
          Body: JSON.stringify(response),
          ContentType: 'application/json',
        },
        callback
      );
    });
  }
}
