import {expect, jest} from "@jest/globals";
import newman from "newman";
import {processCollection, validateInputs} from './runNewman.js';
import {Command} from 'commander';

jest.mock("newman", () => {
    return {run: jest.fn()};
});
jest.mock('commander');

const program = new Command();
jest.mock('./fetchSecret.js');

afterEach(() => {
    jest.clearAllMocks();
});


/**
 * Test function validateInputs for the case "noauth" from command line, but
 * find auth type from collection, expected function to return the auth type
 * from collection; also delete the auth data from collection.
 */
test(validateInputs, () => {
    const authType = "noauth";
    let collection = {
        "item": [],
        "auth": {
            "type": "basic",
            "basic": []
        }
    };
    const authType_rt = validateInputs(authType, collection);
    expect(authType_rt).toBe("basic");
    expect(collection.auth).toBe(undefined)
});
/**
 * Test function validateInputs for the case "noauth" from command line,
 * and no auth type from collection, expected function to return "noauth".
 */
test(validateInputs, () => {
    const authType = "noauth";
    const collection = {"item": []};
    const authType_rt = validateInputs(authType, collection);
    expect(authType_rt).toBe("noauth")
});

/**
 * Test function validateInputs for the case specific authType given from
 * command line, return the same authType no matter what the authType is in the
 * collection; also delete the auth data from collection.
 */
test(validateInputs, () => {
    const authType = "basic";
    const collection = {
        "item": [],
        "auth": {
            "type": "aws4",
            "aws4": []
        }
    };
    const authType_rt = validateInputs(authType, collection);
    expect(authType_rt).toBe("basic");
    expect(collection.auth).toBe(undefined)
});

/**
 * Test function processCollection, expected to add the auth data based on
 * the output from fetchAuthCredentials to the collection.
 */
test('processCollection', () => {
    const collection = {"item": []}
    const authType = "basic";
    const secret = {
        "username": ["test-username", "string", "username"],
        "password": ["test-password", "string", "password"]
    };
    processCollection(collection, authType, secret);
    const expected = {
        "auth": {
            "basic": [{
                "key": "username",
                "type": "string",
                "value": "test-username"
            },
                {
                    "key": "password",
                    "type": "string",
                    "value": "test-password"
                }],
            "type": "basic"
        },
        "item": []
    };
    expect(collection).toStrictEqual(expected)
});
