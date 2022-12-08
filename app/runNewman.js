import {readFileSync} from "fs";

import newman from "newman";
import {fetchAuthCredentials} from "./fetchSecret.js";

/**
 * This function validates the awthType,
 * if authType specified from comment, we delete all auth data from the collection.
 * if authType is noauth, we check if the collection has auth data, if so, we use that authType.
 * if authTpe is noauth, and no auth data is found, we use noauth.
 * @param {string} authType - The type of authentication to use.
 * @param {object} collection - The Postman collection.
 * @returns {string} authType - The type of authentication to use.
 */

function validateInputs(authType, collection) {
    if (authType !== "noauth") {
        delete collection.auth
        for (let item of collection.item) {
            delete item.request.auth;
        }
    } else {
        if ("auth" in collection && "type" in collection.auth) {
            authType = collection.auth.type.toLowerCase();
            delete collection.auth;
        } else {
            for (let item of collection.item) {
                if ("auth" in item.request && "type" in item.request.auth) {
                    authType = item.request.auth.type.toLowerCase();
                    delete item.request.auth;
                }
            }
        }
    }
    return authType;
}

/**
 * This function iterates over the secret object and adds the data to the auth element of the collection.
 * @param collection: The collection to add the auth data to.
 * @param authType: The type of authentication.
 * @param secret: The secret object containing the data.
 */

function processCollection(collection, authType, secret) {
    let authElement = {};
    authElement["type"] = authType;
    authElement[authType] = [];
    for (const [_, value] of Object.entries(secret)) {
        authElement[authType].push({
            key: value[2],
            value: value[0],
            type: value[1]
        });
    }
    collection["auth"] = authElement;
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
    authType = validateInputs(authType, collection);

    if (authType !== "noauth") {
        const secret = await fetchAuthCredentials(program, secretPath, authType);
        processCollection(collection, authType, secret);
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
