import { validateCli, item } from "@1password/op-js";

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
 * Fetch Basic Authentication credentials from 1Password CLI
 * @param {any} program - CLI (for logging errors)
 * @param {string} secretPath - Path in 1Password to secret item
 * @returns - Basic Authentication credentials
 */
 export async function fetchBasicAuthCredentials(program, secretItemPath) {
  const usernameField = `${secretItemPath}/username`;
  const username = await fetchSecret(program, usernameField);
  const passwordField = `${secretItemPath}/password`; 
  const password = await fetchSecret(program, passwordField);

  if (!password || !username) {
    program.error("Invalid Secret Path");
    return {};
  }

  return { username, password };
}

/**
 * Fetch Bearer Token credentials from 1Password CLI
 * @param {any} program - CLI (for logging errors)
 * @param {string} secretPath - Path in 1Password to secret item
 * @returns - Bearer Token credentials
 */
 export async function fetchBearerTokenCredentials(program, secretItemPath) {
  
  const tokenField = `${secretItemPath}/token`;
  const token = await fetchSecret(program, tokenField);
  if (!token) {
    program.error("Invalid Secret Path");
    return {};
  }

  return { token };
}