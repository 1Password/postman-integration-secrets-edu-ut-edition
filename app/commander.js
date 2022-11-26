import { Command } from 'commander';
import {runNewman} from "./runNewman.js";
import * as yaml from 'js-yaml';
import * as fs from 'fs';
const program = new Command();

program
  .name('1password-postman')
  .description('CLI to apply 1password secrets in postman')
  .version('0.0.1');

program.command('run-collection')
  .description('Run Postman collection with 1password secret')
  .option('--mode <char>, -m <char>', 'Specify if it is for testing(t) or production(p)', 'p')
  .option('--type <char>, -t <char>', 'Specify the type of authorization', 'NoAuth')
  .argument('<secret>', '1password secret resource path')
  .argument('<collection>', 'collection configuration to insert')
  .action((secret, collection, options) => {
    const re = new RegExp('op:\/\/')
    if(!re.test(secret)){
      throw 'Error: invalid secret path';
    }
    const doc = yaml.load(fs.readFileSync('app/authType.yml', 'utf8'));
    if(!(options.type in doc)){
      throw 'Error: type not valid. Allowed types are NoAuth, ApiKey, Bearer\n' +
            'Basic, Digest, OAuth1, OAuth2, Hawk, AWS, NTLM, Akamai';
    }
  
    console.log('secret:', secret);
    console.log('collection:', collection);
    console.log('options:', options.mode);
    console.log('type:', options.type);
    //runNewman(program, collection, secret, type);
  });

program.parse();