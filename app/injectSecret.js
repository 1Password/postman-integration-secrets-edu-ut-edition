import fetch from 'node-fetch';
import { fetchSecret } from './fetchSecret.js';

// Postman API URL
const POSTMAN_ENV_API = 'https://api.getpostman.com/environments';

/**
 * Make API call to Postman
 * 
 * @param {string} apiKey - API to authenticate Postman with
 * @param {string} requestUrl - Request URL
 * @param {string} method - Request method (Ex. 'get', 'put', 'post', etc.)
 * @param {Object} body - Request body
 * @returns - Response data
 */
async function callPostmanApi(apiKey, requestUrl, method, body) {
  const requestOptions = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
  };
  if (method === 'post' || method === 'put') {
    requestOptions.body = JSON.stringify(body);
  }
  const response = await fetch(requestUrl, requestOptions);
  const data = await response.json();
  return data;
}

/**
 * Map a 1Password secret field to a Postman environment variable
 * 
 * @param {Array} secretField - 1
 * @returns - Secret fields formatted as Postman variables
 */
function secretFieldToPostmanVar(secretField) {
  return {
    key: secretField.key,
    value: secretField.value,
    enabled: true,
    type: secretField.type === "CONCEALED" ? "secret" : "default"
  };
}

/**
 * Check if an environment with given name exists in Postman
 * 
 * @param {string} postmanCred - Postman API credential
 * @param {string} envName - Name of environment
 * @returns - true if environment exists, false otherwise
 */
async function envExists(postmanCred, envName) {
  const data = await callPostmanApi(postmanCred, POSTMAN_ENV_API, 'get', {});
  const envs = data.environments.find((env) => env.name == envName);
  return !!envs ? envs.id : '';
}

/**
 * Inject secrets into an existing Postman Environment
 * 
 * @param {any} program - CLI
 * @param {string} envName - Name of environment to update
 * @param {string} postmanCred - Postman API credential
 * @param {string} envId - ID of environment to update
 * @param {Array} secrets - Secrets to inject 
 * @param {bool} replaceEnv - Option to replace the environment instead of merging
 */
async function updateEnv(program, envName, postmanCred, envId, secrets, replaceEnv) {

  let envValues = [];

  if(replaceEnv) {
    // Replace environment with secrets provided
    envValues = secrets;
  } else {
    // Merge Environment with (potentially) new secrets and update old secrets
    const envData = await callPostmanApi(postmanCred, `${POSTMAN_ENV_API}/${envId}`, 'get', {});
  
    envValues = envData.environment.values;
    const unmatchedSecrets = [];
  
    secrets.forEach((secret) => {
      const match = envValues.findIndex((envVar) => envVar.key == secret.key);
      if(match >= 0) {
        envValues[match].value = secret.value;
      } else {
        unmatchedSecrets.push(secret);
      }
    });
  
    envValues = [...envValues, ...unmatchedSecrets];
  }

  const body = {
    environment: {
      name: envName,
      values: envValues
    }
  };
  const data = await callPostmanApi(postmanCred, `${POSTMAN_ENV_API}/${envId}`, 'put', body);
}

/**
 * Inject given secrets into given Postman environment
 * 
 * @param {any} program - CLI 
 * @param {string} postmanSecret - Postman API Secret
 * @param {Array} secrets - Secrets to Inject
 * @param {Object} env - Environment configuration (name and replace)
 */
export async function injectSecretIntoPostman(program, postmanSecret, secrets, env) {
  
  const {envName, replaceEnv} = env;

  const postmanCred = await fetchSecret(program, `${postmanSecret}/credential`);

  const values = secrets.map((secret) => secretFieldToPostmanVar(secret));
  const body = {
    environment: {
      name: envName,
      values
    }
  };

  const updateEnvId = await envExists(postmanCred, envName);
  if(!!updateEnvId) {
    await updateEnv(program, envName, postmanCred, updateEnvId, values, replaceEnv);
  } else {
    const data = await callPostmanApi(postmanCred, POSTMAN_ENV_API, 'post', body);
  }
}