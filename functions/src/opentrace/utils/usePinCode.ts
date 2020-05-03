import * as admin from "firebase-admin";
import moment = require("moment");
import getEncryptionKey from "./getEncryptionKey";
import CustomEncrypter from "./CustomEncrypter";

async function usePinCode(code : string): Promise<boolean>
{
    const encryptionKey = await getEncryptionKey();
    const customEncrypter = new CustomEncrypter(encryptionKey);

    const encodedCode = customEncrypter.encryptAndEncode(Buffer.from(code)).toString('hex');

    const pinCode = await admin.firestore().collection('codes').doc(encodedCode).get();

    await admin.firestore().collection('codes').doc(encodedCode).delete();

    return !(pinCode.data() === undefined || moment().unix() > pinCode.get('expiryTime'));
}

export default usePinCode;
