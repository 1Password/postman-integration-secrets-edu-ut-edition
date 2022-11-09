const { Command } = require('commander');
const program = new Command();

program
  .name('1password-postman')
  .description('CLI to apply 1password secrets in postman')
  .version('0.0.1');

program.command('insert-secret')
  .description('Secify if it is for testing or production')
  .option('--mode, -m', 'Secify if it is for testing(t) or production(p)', 'p')
  .argument('<string>', '1password secret resource path')
  .argument('<string>, <object>', 'collection configuration to insert')

program.parse();

const options = program.opts()
if (options.mode == 't') {
    pass;
} else if (options.mode == 'p'){
    pass;
}