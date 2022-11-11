import {fetchSecret} from "./fetchSecret.js";
import {Command} from "commander";
import {readFileSync} from "fs";

import newman from "newman";

function processApiKeyItem(item) {
    for (let key of item.request.auth.apikey) {
        const program = new Command();
        let apikey = "empty";
        fetchSecret(program, "some path").then(value => {
            apikey = value
        });
        switch (key.key) {
            case "value":
                key.value = apikey;
                break;
            case "key":
                key.value = "apikey";
                break;
        }
    }
}

function processCollectionItem(item) {
    switch (item.request.auth.type) {
        case "apikey":
            processApiKeyItem(item);
            break;
    }
}

function runNewman(collection_file, output) {
    let collection = JSON.parse(readFileSync(collection_file));
    for (let item of collection.item) {
        processCollectionItem(item);
    }
    newman.run({
        collection: collection,
        reporters: 'json',
        reporter: {
            json: {
                export: output,
            },
        }
    }, function (err) {
        if (err) {
            throw err;
        }
    });
}