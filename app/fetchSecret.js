import { validateCli, item } from "@1password/op-js";
import * as yaml from 'js-yaml';
import * as fs from 'fs';

/**
 * Fetch secret from 1Password CLI
 * @param {any} program - CLI (for logging errors)
 * @param {string} secretPath - Path in 1Password to secret
 * @returns - Secret
 */
 export async function fetchSecret(program, secretPath) {
  try {
    await validateCli();
  } catch(error) {
    // User has not installed 1Password CLI, send error message
    program.error(error.message);
    return ;
  }
  const [vault, name, field] = secretPath.slice(5).split('/');
  try {
    const data = item.get(name, {fields: [field], vault: vault});
    return data.value;
  } catch(error) {
    return ;
  }
  
}

/**
 * Fetch all fields of a secret from 1Password CLI
 * 
 * @param {any} program - CLI (for logging errors)
 * @param {string} secretId - ID of secret
 * @returns - all fields in the secret
 */
 export async function fetchSecretFields(program, secretId) {
  try {
    await validateCli();
  } catch(error) {
    // User has not installed 1Password CLI, send error message
    program.error(error.message);
    return ;
  }
  try {
    const data = item.get(secretId);
    return data.fields;
  } catch(error) {
    return ;
  }
  
}

/**
 * Fetch all secrets from 1Password CLI
 * @param {any} program - CLI (for logging errors)
 * @returns - secrets
 */
 export async function fetchAllSecrets(program) {
  try {
    await validateCli();
  } catch(error) {
    // User has not installed 1Password CLI, send error message
    program.error(error.message);
    return ;
  }

  try {
    const data = item.list();
    return data;
  } catch(error) {
    return ;
  }
  
}

/**
 * Fetch Authentication credentials from 1Password CLI
 * @param {any} program - CLI (for logging errors)
 * @param {string} secretPath - Path in 1Password to secret item
 * @returns - Authentication credentials
 */
 export async function fetchAuthCredentials(program, secretItemPath, secretType) {
  let rst = {}
  const path = process.cwd();
  const doc = yaml.load(fs.readFileSync(path + '/app/authType.yml', 'utf8'))[secretType];
  for (let field of Object.keys(doc)) {
    let cred = await fetchSecret(program, `${secretItemPath}/${field}`);
    if (!cred){
      if (doc[field]['required'] == true){
        program.error(`Invalid Secret Path: ${field} not exist in current 1password secret path`);
        return {};
      } else if ('default' in doc[field]) {
        cred = doc[field]['default'];
      } else{
        continue;
      }
    }
    if ('options' in doc[field]){
      if (!(doc[field]['options'].includes(cred))){
        program.error(`Invalid Field Value: ${field} value is not valid`);
        return {};
      }
    }
    rst[field] = [cred, doc[field]['type'], doc[field]['variant']]
  }

  return rst;
}
