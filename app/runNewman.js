const newman = require('newman');

function getApiKey() {
    // This is a mock function for testing
    return ["api_key", "test"];
}

function processApiKeyItem(item) {
    for (let key of item.request.auth.apikey) {
        const [key_name, key_value] = getApiKey();
        switch (key.key) {
            case "value":
                key.value = key_value;
                break;
            case "key":
                key.value = key_name;
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
    let collection = require(collection_file);
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
