import { inject, validateCli } from "@1password/op-js";

/**
 * Fetch secret from 1Password CLI
 * @param {any} program - CLI
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
  const data = inject.data(secretPath);
  return data;
}
