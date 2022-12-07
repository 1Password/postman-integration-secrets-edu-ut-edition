import { fetchSecret } from './fetchSecret.js';
import { callPostmanApi, envExists, updateEnv, POSTMAN_ENV_API } from './postmanApi.js';


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
  let data = null;
  if(!!updateEnvId) {
    data = await updateEnv(program, envName, postmanCred, updateEnvId, values, replaceEnv);
  } else {
    data = await callPostmanApi(postmanCred, POSTMAN_ENV_API, 'post', body);
  }

  if(data) {
    console.log("🎉 Success 🎉");
  }
}