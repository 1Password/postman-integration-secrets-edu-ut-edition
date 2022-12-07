import { Command } from 'commander';
import { injectSecretIntoPostman } from './injectSecret.js';
import {runNewman} from "./runNewman.js";
import { selectSecrets } from './selectSecrets.js';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

const program = new Command();
const path = process.cwd();
program
  .name('1password-postman')
  .description('CLI to apply 1password secrets in postman')
  .version('0.0.1');

program.command('run-collection')
  .description('Run Postman collection with 1Password secret')
  .option('--mode <char>', 'Specify if it is for testing(t) or production(p)', 'p')
  .option('--type <char>', 'Specify the type of authorization', 'NoAuth')
  .argument('<secret>', '1Password secret resource path')
  .argument('<collection>', 'collection configuration to insert')
  .action((secret, collection, options) => {
    const re = new RegExp('op:\/\/')
    if(!re.test(secret)){
      throw 'Error: invalid secret path';
    }
    const doc = yaml.load(fs.readFileSync(path + '/app/authType.yml', 'utf8'));
    const type_lower = options.type.toLowerCase()
    if(!(type_lower in doc)){
      throw 'Error: type not valid. Allowed types are NoAuth, ApiKey, Bearer\n' +
            'Basic, Digest, OAuth1, OAuth2, Hawk, AWS, NTLM, Akamai';
    }
    if(options.mode == 't'){
      console.log('secret:', secret);
      console.log('collection:', collection);
      console.log('options:', options.mode);
      console.log('type:', options.type);
    }
    
    runNewman(program, collection, secret, type_lower);
  });

program.command('inject-secrets')
  .description('Inject Secrets into Postman Environment ')
  .option('-s, --postman-secret <secret>', '1Password secret path to Postman API Credential. It can also be provided as an environment variable: POSTMAN_API_KEY_PATH')
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
    } else if(process.env.POSTMAN_API_KEY_PATH ) {
      postmanSecret = process.env.POSTMAN_API_KEY_PATH;
    } else {
      program.error("No Postman API Credential specified.");
      return;
    }
    const secrets = await selectSecrets(program);
    await injectSecretIntoPostman(program, postmanSecret, secrets, {envName: options.env, replaceEnv: !!options.replaceEnv})
  });


program.parse();