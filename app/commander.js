import { Command } from 'commander';
import { injectSecretIntoPostman } from './injectSecret.js';
import {runNewman} from "./runNewman.js";
import { selectSecrets } from './selectSecrets.js';

const program = new Command();

program
  .name('1password-postman')
  .description('CLI to apply 1password secrets in postman')
  .version('0.0.1');

program.command('run-collection')
  .description('Run Postman collection with 1password secret')
  .option('--mode <char>, -m <char>', 'Secify if it is for testing(t) or production(p)', 'p')
  .argument('<secret>', '1password secret resource path')
  .argument('<collection>', 'collection configuration to insert')
  .action((secret, collection, options) => {
    const re = new RegExp('op:\/\/')
    if(!re.test(secret)){
      throw 'Error: invalid secret path';
    }
    console.log('secret:', secret);
    console.log('collection:', collection);
    console.log('options:', options.mode);
    runNewman(program, collection, secret);
  });

program.command('inject-secrets')
  .description('Inject Secrets into Postman Environment ')
  .option('-s, --postman-secret <secret>', '1Password secret path to Postman API Credential. It can also be provided as an environment variable: POSTMAN_API_CREDENTIAL')
  .option('-e, --env <env-name>', '(Optional) name of Postman environment to inject secrets into', '1password-secrets')
  .option('-r, --replace-env', '(Optional) replace the entire Postman environment with secrets instead of merging (default behaviour)')
  .action(async (options) => {
    let postmanSecret;
    if(options.postmanSecret) {
      const re = new RegExp('op:\/\/')
      if(!re.test(options.postmanSecret)){
        program.error('Error: invalid secret path');
        return;
      }
      postmanSecret = options.postmanSecret;
    } else if(process.env.POSTMAN_API_CREDENTIAL ) {
      postmanSecret = process.env.POSTMAN_API_CREDENTIAL;
    } else {
      program.error("No Postman API Credential specified.");
      return;
    }
    const secrets = await selectSecrets(program);
    await injectSecretIntoPostman(program, postmanSecret, secrets, {envName: options.env, replaceEnv: !!options.replaceEnv})
  });


program.parse();