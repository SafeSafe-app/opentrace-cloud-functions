import * as functions from "firebase-functions";

import config from "./config";
import getApiToken from "./opentrace/utils/getApiToken";

/**
 * Wrapper around functions to handle authentication
 * @param handler
 * @param runtimeOpt
 */
export function https(
  handler: (uid: string, data: any, context: functions.https.CallableContext) => any | Promise<any>,
  runtimeOpt: functions.RuntimeOptions = {memory: '256MB', timeoutSeconds: 60}
): functions.HttpsFunction {
  return functions
    .runWith(runtimeOpt)
    .region(...config.regions)
    .https.onCall(async (data, context) => {
      const uid = await config.authenticator.authenticate(data, context);

      return handler(uid, data, context);
    });
}

export function storage(
  bucket: string,
  handler: (object: functions.storage.ObjectMetadata) => any | Promise<any>,
  runtimeOpt: functions.RuntimeOptions = {memory: '256MB', timeoutSeconds: 60}
): functions.CloudFunction<functions.storage.ObjectMetadata> {
  return functions
    .runWith(runtimeOpt)
    .region(...config.regions)
    .storage.bucket(bucket).object().onFinalize(async (object) => {
      return handler(object);
    });
}

export function httpsWithApiToken(
    handler: (data: any) => Promise<any>,
    runtimeOpt: functions.RuntimeOptions = {memory: '256MB', timeoutSeconds: 60}
): functions.HttpsFunction {
    return functions
        .runWith(runtimeOpt)
        .region(...config.regions)
        .https.onCall(async (data: any, context: functions.https.CallableContext) => {
            const apiToken = await getApiToken();
            const headerToken = Buffer.from(String(context.rawRequest.header('api-token')), 'base64');

            if (!headerToken.equals(apiToken)) {
                throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
            }

            return handler(context.rawRequest.body.data);
        });
}
