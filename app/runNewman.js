import {fetchBasicAuthCredentials} from "./fetchSecret.js";
import {Command} from "commander";
import {readFileSync} from "fs";

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

export async function runNewman(program, collectionPath, secretPath) {
    let collection = JSON.parse(readFileSync(collectionPath));
    const secret = await fetchBasicAuthCredentials(program, secretPath);
    for (let item of collection.item) {
        processCollectionItem(item, secret);
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