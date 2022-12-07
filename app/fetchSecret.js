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
  const passwordField = `${secretItemPath}/credential`; 
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
  
  const tokenField = `${secretItemPath}/credential`;
  const token = await fetchSecret(program, tokenField);
  if (!token) {
    program.error("Invalid Secret Path");
    return {};
  }

  return { token };
}

/**
 * Fetch API Key Authentication credentials from 1Password CLI
 * @param {any} program - CLI (for logging errors)
 * @param {string} secretPath - Path in 1Password to secret item
 * @returns - API key Authentication credentials
 */
 export async function fetchAPIKeyCredentials(program, secretItemPath) {
  const keyField = `${secretItemPath}/key`;
  const key = await fetchSecret(program, keyField);
  const valueField = `${secretItemPath}/value`; 
  const value = await fetchSecret(program, valueField);
  const inField = `${secretItemPath}/in`;
  const inVal = await fetchSecret(program, inField);

  if (!key || !value || !inVal) {
    program.error("Invalid Secret Path");
    return {};
  }

  return { key, value, inVal };
}

/**
 * Fetch Digest Authentication credentials from 1Password CLI
 * @param {any} program - CLI (for logging errors)
 * @param {string} secretPath - Path in 1Password to secret item
 * @returns - Digest Authentication credentials
 */
 export async function fetchDigestAuthCredentials(program, secretItemPath) {
  const usernameField = `${secretItemPath}/username`;
  const username = await fetchSecret(program, usernameField);
  const passwordField = `${secretItemPath}/password`; 
  const password = await fetchSecret(program, passwordField);
  const algorithmField = `${secretItemPath}/algorithm`;
  const algorithm = await fetchSecret(program, algorithmField);

  if (!username || !password || !algorithm) {
    program.error("Invalid Secret Path");
    return {};
  }

  return { username, password, algorithm };
}

/**
 * Fetch AWS Signature Authentication credentials from 1Password CLI
 * @param {any} program - CLI (for logging errors)
 * @param {string} secretPath - Path in 1Password to secret item
 * @returns - AWS Signature Authentication credentials
 */
 export async function fetchAWSSignatureCredentials(program, secretItemPath) {
  const accessKeyField = `${secretItemPath}/accessKey`;
  const accessKey = await fetchSecret(program, accessKeyField);
  const secretKeyField = `${secretItemPath}/secretKey`; 
  const secretKey = await fetchSecret(program, secretKeyField);

  if (!accessKey || !secretKey) {
    program.error("Invalid Secret Path");
    return {};
  }

  return { accessKey, secretKey };
}

/**
 * Fetch Hawk Authentication credentials from 1Password CLI
 * @param {any} program - CLI (for logging errors)
 * @param {string} secretPath - Path in 1Password to secret item
 * @returns - Hawk Authentication credentials
 */
 export async function fetchHawkAuthCredentials(program, secretItemPath) {
  const authKeyField = `${secretItemPath}/authKey`;
  const authKey = await fetchSecret(program, authKeyField);
  const authIdField = `${secretItemPath}/authId`; 
  const authId = await fetchSecret(program, authIdField);
  const algorithmField = `${secretItemPath}/algorithm`;
  const algorithm = await fetchSecret(program, algorithmField);

  if (!authKey || !authId || !algorithm) {
    program.error("Invalid Secret Path");
    return {};
  }

  return { authKey, authId, algorithm };
}

/**
 * Fetch NTLM Authentication credentials from 1Password CLI
 * @param {any} program - CLI (for logging errors)
 * @param {string} secretPath - Path in 1Password to secret item
 * @returns - NTLM Authentication credentials
 */
 export async function fetchNTLMAuthCredentials(program, secretItemPath) {
  const usernameField = `${secretItemPath}/username`;
  const username = await fetchSecret(program, usernameField);
  const passwordField = `${secretItemPath}/password`; 
  const password = await fetchSecret(program, passwordField);

  if (!username || !password) {
    program.error("Invalid Secret Path");
    return {};
  }

  return { username, password };
}

/**
 * Fetch Akamai EdgeGrid Authentication credentials from 1Password CLI
 * @param {any} program - CLI (for logging errors)
 * @param {string} secretPath - Path in 1Password to secret item
 * @returns - Akamai EdgeGrid Authentication credentials
 */
 export async function fetchEdgeGridCredentials(program, secretItemPath) {
  const clientSecretField = `${secretItemPath}/clientSecret`;
  const clientSecret = await fetchSecret(program, clientSecretField);
  const clientTokenField = `${secretItemPath}/clientToken`; 
  const clientToken = await fetchSecret(program, clientTokenField);
  const accessTokenField = `${secretItemPath}/accessToken`;
  const accessToken = await fetchSecret(program, accessTokenField);

  if (!clientSecret || !clientToken || !accessToken) {
    program.error("Invalid Secret Path");
    return {};
  }

  return { clientSecret, clientToken, accessToken };
}
