import { fetchBasicAuthCredentials } from "./fetchSecret.js";
import { readFileSync } from "fs";

import newman from "newman";

export function processCollectionItem(item, secret) {
    for (let key of item.request.auth[item.request.auth.type]) {
        if (secret[key.key] !== undefined) {
            key.value = secret[key.key];
        } else {
            console.log("Secret not found: " + key.key);
        }
    }
}

export async function runNewman(program, collectionPath, secretPath, authType) {
    let collection = JSON.parse(readFileSync(collectionPath));
    // TODO: add more auth types
    const funcMap = {"basic": fetchBasicAuthCredentials};
    if (authType !== "noauth") {
        const secret = await funcMap[authType](program, secretPath);
        for (let item of collection.item) {
            processCollectionItem(item, secret);
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