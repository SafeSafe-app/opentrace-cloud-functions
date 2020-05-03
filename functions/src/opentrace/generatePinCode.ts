import * as admin from "firebase-admin";
import * as moment from "moment";
import config from "../config";
import getEncryptionKey from "./utils/getEncryptionKey";
import CustomEncrypter from "./utils/CustomEncrypter";

export async function generatePinCode(data : any) {
    const code = (Math.random()).toString(36).toLocaleUpperCase().substring(2, 8);
    const expiryTime = moment().unix() + 60 * config.pin.lifetime;

    const encryptionKey = await getEncryptionKey();
    const customEncrypter = new CustomEncrypter(encryptionKey);

    const encryptedCode = customEncrypter.encryptAndEncode(Buffer.from(code));

    await admin.firestore().collection('codes').doc(encryptedCode.toString('hex')).set({"expiryTime" : expiryTime});

    return code;
}

export default generatePinCode;
