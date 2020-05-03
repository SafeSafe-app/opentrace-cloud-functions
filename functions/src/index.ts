import * as admin from "firebase-admin";
admin.initializeApp();

import * as firebaseFunctions from "./firebaseFunctions";
import config from "./config";

import getHandshakePin from "./opentrace/getHandshakePin";
import getTempIDs from "./opentrace/getTempIDs";
import getUploadToken from "./opentrace/getUploadToken";
import processUploadedData from "./opentrace/processUploadedData";
import storeUploadCodes from "./opentrace/storeUploadedCodes";
import {pubsub} from "firebase-functions";
import clearUnusedPinCodes from "./opentrace/clearUnusedPinCodes";

exports.getHandshakePin = firebaseFunctions.https(getHandshakePin);
exports.getTempIDs = firebaseFunctions.https(getTempIDs);
exports.getUploadToken = firebaseFunctions.https(getUploadToken);
exports.processUploadedData = firebaseFunctions.storage(config.upload.bucket, processUploadedData);
exports.storeUploadCodes = firebaseFunctions.httpsWithApiToken(storeUploadCodes);
exports.clearUnusedPinCodes = pubsub.schedule('every 1 hour').onRun(clearUnusedPinCodes);
