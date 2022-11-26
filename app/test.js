// utility file for checking if configuration is correct
import * as yaml from 'js-yaml';
import * as fs from 'fs';
try {
    const doc = yaml.load(fs.readFileSync('app/authType.yml', 'utf8'));
    console.log(doc);
    
  } catch (e) {
    console.log(e);
  }