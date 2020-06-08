import {SecretManagerServiceClient} from "@google-cloud/secret-manager";

import config from "../../config";

const SECRET_KEY = `projects/${config.projectId}/secrets/${config.api.keyPath}`;
const SECRET_KEY_DEFAULT_VERSION = `${SECRET_KEY}/versions/${config.api.defaultVersion}`;

const getApiToken = async (): Promise<Buffer> => getEncryptionSecret(SECRET_KEY_DEFAULT_VERSION);

async function getEncryptionSecret(keyPathIncludingVersion: string): Promise<Buffer> {
  const secretManagerClient = new SecretManagerServiceClient();

  console.log("getEncryptionSecret:", `Getting encryption key: ${keyPathIncludingVersion}`);
  const [secret] = await secretManagerClient.accessSecretVersion({
    name: keyPathIncludingVersion,
  });

  // @ts-ignore
  return Buffer.from(secret.payload.data.toString(), 'base64');
}

export default getApiToken;