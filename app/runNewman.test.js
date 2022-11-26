import {runNewman} from './runNewman.js';
import {processCollectionItem} from './runNewman.js';
import {expect, jest} from "@jest/globals";
test('processCollectionItem', () => {
    const item = {
        request: {
            auth: {
                "type":"basic",
                "basic": [{
                    "key": "username",
                    "value": "{{api-secret-username}}",
                    "type": "string"
                    },
                    {"key":"password",
                     "value":"{{api-secret-password}}",
                     "type":"string"}]
            }
        }
    };
    let secret = {"username":"test-username", "password":"test-password"};
    processCollectionItem(item, secret);
    expect(item.request.auth.basic[0].value).toBe("test-username");
    expect(item.request.auth.basic[1].value).toBe("test-password");

    jest.spyOn(console, 'log');
    secret = {};
    processCollectionItem(item, secret);
    expect(console.log.mock.calls[0][0]).toBe("Secret not found: username");
    expect(console.log.mock.calls[1][0]).toBe("Secret not found: password");
});