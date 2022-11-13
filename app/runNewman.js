import {fetchSecret} from "./fetchSecret.js";
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

export async function runNewman(collectionPath, secretPath) {
    let collection = JSON.parse(readFileSync(collectionPath));
    const program = new Command();
    const secret = await fetchSecret(program, secretPath);
    for (let item of collection.item) {
        processCollectionItem(item, secret);
    }
    newman.run({
        collection: collection,
    }, function (err) {
        if (err) {
            throw err;
        }
    });
}