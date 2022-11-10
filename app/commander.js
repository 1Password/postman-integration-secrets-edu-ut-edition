import { Command } from 'commander';
const program = new Command();

program
  .name('1password-postman')
  .description('CLI to apply 1password secrets in postman')
  .version('0.0.1');

program.command('insert-secret')
  .description('Secify if it is for testing or production')
  .option('--mode <char>, -m <char>', 'Secify if it is for testing(t) or production(p)', 'p')
  .argument('<secret>', '1password secret resource path')
  .argument('<collection>', 'collection configuration to insert')
  .action((secret, collection, options) => {
    const re = new RegExp('op:\/\/')
    if(!re.test(secret)){
      console.log('Error: invalid secret path')
    }
    console.log('secret:', secret);
    console.log('collection:', collection);
    console.log('options:', options.mode);
  });

program.parse();