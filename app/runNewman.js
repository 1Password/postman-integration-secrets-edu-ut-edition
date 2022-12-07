import { fetchBasicAuthCredentials, fetchBearerTokenCredentials } from "./fetchSecret.js";
import { readFileSync } from "fs";

import newman from "newman";

/**
 * Process Postman collection to inject secret
 * 
 * @param {any} item - Collection item
 * @param {any} secret - 1Password Secret 
 * @param {string} authType - Type of authentication
 * @returns Collection Item
 */
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

/**
 * Inject secret and run Newman CLI to execute Collection JSON
 * 
 * @param {any} program - CLI
 * @param {string} collectionPath - Path to Postman Collection JSON
 * @param {string} secretPath - Reference path to the 1Password Secret
 * @param {string} authType - Type of the Authentication 
 */
export async function runNewman(program, collectionPath, secretPath, authType) {
    let collection = JSON.parse(readFileSync(collectionPath));
    // TODO: add more auth types
    const funcMap = {"basic": fetchBasicAuthCredentials,
                     "bearer": fetchBearerTokenCredentials};
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