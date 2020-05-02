import * as functions from "firebase-functions";
import getEncryptionKey from "./utils/getEncryptionKey";
import CustomEncrypter from "./utils/CustomEncrypter";
import * as admin from "firebase-admin";
import formatTimestamp from "./utils/formatTimestamp";

export async function storeUploadCodes(uploadCodes: string[]) {
    if (!Array.isArray(uploadCodes)) {
        throw new functions.https.HttpsError('invalid-argument', `uploadedCodes must be type array of strings`);
    }

    // Prepare encrypter
    const encryptionKey = await getEncryptionKey();
    const customEncrypter = new CustomEncrypter(encryptionKey);

    const payload = Buffer.from(JSON.stringify(uploadCodes));

    // Encode payload
    const payloadData = customEncrypter.encryptAndEncode(payload);

    const writeResult = await admin.firestore().collection('codes').doc('uploadCode').set({uploadCode: payloadData.toString('base64')});
    console.log('storeCodes:', 'upload code is stored successfully at', formatTimestamp(writeResult.writeTime.seconds));

    return {
        status: "SUCCESS"
    };
}

export default storeUploadCodes;