import inquirer from 'inquirer';
import { fetchAllSecrets, fetchSecretFields } from './fetchSecret.js';

/**
 * Prompts user to select secrets from their 1Password account
 * 
 * @param {any} program - CLI
 * @returns - List of all the fields of the secrets user selected
 */
export async function selectSecrets(program) {
  let secrets = await fetchAllSecrets();
  return inquirer
    .prompt([
      {
        name: 'secrets',
        message: 'Please select the secrets you want to inject into Postman\n\n',
        type: 'checkbox',
        choices: [
          new inquirer.Separator(), 
          ...secrets.map(item => `${item.title}`.padEnd(35) + '|' + `${item.vault.name}`.padStart(30))
        ]
      },
    ])
    .then(async (answers) => {
      const answerNames = answers.secrets.map((a) => a.split('|')[0].trim());
      const secretsToInject = secrets.filter((secret) => {
        return answerNames.find((a) => a === secret.title);
      });
      const funcs = secretsToInject.map(async (secret) => await fetchSecretFields(program, secret.id));
      return Promise.all(funcs)
    })
    .then((secretItemFields) => {
      // Each field is its own variable, we only take fields that have a value (not empty)
      const fieldsToInject = secretItemFields.flat().map((field) => {
        if(field.value) {
          return {
            key: field.reference,
            value: field.value,
            type: field.type
          };
        } else {
          return false;
        }
      });
      return fieldsToInject.filter(field => field);
    });
}