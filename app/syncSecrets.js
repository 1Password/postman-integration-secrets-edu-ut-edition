import { updateEnv, callPostmanApi, POSTMAN_ENV_API } from './postmanApi.js';
import { fetchSecret } from './fetchSecret.js'

/**
 * Sync previously injected secrets (from 1Password) in a Postman environment to their latest values
 * 
 * @param {any} program - CLI
 * @param {string} postmanSecret - 1Password reference path to Postman API Key
 * @param {string} envName - Name of Postman Environment to update
 */
export async function syncSecrets(program, postmanSecret, envName) {

  const postmanCred = await fetchSecret(program, `${postmanSecret}/credential`);

  const envs = await callPostmanApi(postmanCred, POSTMAN_ENV_API, 'get', {});
  const envToUpdate = envs.environments.find((env) => env.name == envName);

  if(!envToUpdate) {
    program.error("Environment Not Found");
  }
  const envToUpdateId = envToUpdate.id;

  const envVars = await callPostmanApi(postmanCred, `${POSTMAN_ENV_API}/${envToUpdateId}`, 'get', {});

  const re = new RegExp('op:\/\/');
  let updatedSecrets = envVars.environment.values
    .filter((envVar) => re.test(envVar.key))
    .map(async (envVar) => {
      const latestSecretVal = await fetchSecret(program, envVar.key);
      
      if(latestSecretVal) {
        envVar.value = latestSecretVal; 
      }
      return envVar;
    });
  updatedSecrets = await Promise.all(updatedSecrets);
  const data = await updateEnv(program, envName, postmanCred, envToUpdateId, updatedSecrets, false);
  if(data) {
    console.log("🎉 Success 🎉");
  }
}
