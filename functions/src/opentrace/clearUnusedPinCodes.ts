import {EventContext} from "firebase-functions";
import * as admin from "firebase-admin";
import moment = require("moment");

const clearUnusedPinCodes = async (context: EventContext) => {
    const pinCodes = await admin.firestore().collection('codes').listDocuments();

    for (const document of pinCodes) {
        const pinCode = await document.get();

        if (moment().unix() > pinCode.get('expiryTime')) {
            await document.delete();
        }
    }
};

export default clearUnusedPinCodes;
