import * as admin from "firebase-admin";
import * as firebaseFunctions from "./firebaseFunctions";
import config from "./config";

import getHandshakePin from "./opentrace/getHandshakePin";
import getTempIDs from "./opentrace/getTempIDs";
import getUploadToken from "./opentrace/getUploadToken";
import processUploadedData from "./opentrace/processUploadedData";
import generatePinCode from "./opentrace/generatePinCode";

admin.initializeApp();

exports.getHandshakePin = firebaseFunctions.https(getHandshakePin);
exports.getTempIDs = firebaseFunctions.https(getTempIDs);
exports.getUploadToken = firebaseFunctions.https(getUploadToken);
exports.processUploadedData = firebaseFunctions.storage(config.upload.bucket, processUploadedData);
exports.generatePinCode = firebaseFunctions.httpsWithApiToken(generatePinCode);
