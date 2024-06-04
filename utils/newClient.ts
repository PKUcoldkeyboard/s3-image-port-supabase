import { type S3Settings } from "~/types";
import { S3Client } from "@aws-sdk/client-s3";

export default function (s3Settings: S3Settings): S3Client {
  return new S3Client({
    forcePathStyle: true,
    region: s3Settings.region,
    credentials: {
      accessKeyId: s3Settings.accKeyId,
      secretAccessKey: s3Settings.secretAccKey,
      sessionToken: s3Settings.sessionToken,
    },
    endpoint: s3Settings.endpoint,
  });
}
