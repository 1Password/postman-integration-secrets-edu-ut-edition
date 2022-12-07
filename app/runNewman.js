import { fetchAPIKeyCredentials, fetchAWSSignatureCredentials, fetchBasicAuthCredentials, fetchBearerTokenCredentials, fetchEdgeGridCredentials, fetchHawkAuthCredentials, fetchNTLMAuthCredentials } from "./fetchSecret.js";
import { readFileSync } from "fs";

import newman from "newman";

export function processCollectionItem(item, secret, authType) {
    if (item.request.auth.type.toLowerCase() !== authType) {
        throw new Error("Auth type does not match with template");
    }
    for (let key of item.request.auth[item.request.auth.type]) {
        if (secret[key.key] !== undefined) {
            key.value = secret[key.key];
            delete secret[key.key];
        }
        else
            key.value = "";
    }
    if (Object.keys(secret).length > 0)
        throw new Error("Malformed secret");
    return item;
}

export async function runNewman(program, collectionPath, secretPath, authType) {
    let collection = JSON.parse(readFileSync(collectionPath));
    // TODO: add more auth types
    const funcMap = {"basic": fetchBasicAuthCredentials,
                     "bearer": fetchBearerTokenCredentials,
                     "hawk": fetchHawkAuthCredentials,
                     "apikey": fetchAPIKeyCredentials,
                     "awsv4": fetchAWSSignatureCredentials,
                     "ntlm": fetchNTLMAuthCredentials,
                     "edgegrid": fetchEdgeGridCredentials};
    if (authType !== "noauth") {
        const secret = await funcMap[authType](program, secretPath);
        for (let item of collection.item) {
            processCollectionItem(item, secret, authType);
        }
    }
    newman.run({
        collection: collection,
        reporters: "cli"
    }, function (err) {
        if (err) {
            throw err;
        }
    });
}