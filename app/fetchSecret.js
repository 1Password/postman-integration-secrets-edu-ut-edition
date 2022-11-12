import { inject, validateCli } from "@1password/op-js";

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

  try {
    const data = inject.data(secretPath);
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
 export async function fetchBasicAuth(program, secretItemPath) {
  
  const usernameField = `${secretItemPath.replace(/\/$/, "")}/username`;
  const username = await fetchSecret(program, usernameField);
  const passwordField = `${secretItemPath.replace(/\/$/, "")}/password`; 
  const password = await fetchSecret(program, passwordField);

  if (!password || !username) {
    program.error("Invalid Secret Path");
    return {};
  }

  return { username, password };
}