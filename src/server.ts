import * as Queue from 'bull';

import App from './app';


require('dotenv').config();

const app = new App();

process.on('unhandledRejection', err => {
  console.log('(unhandledRejection) Uncaughted Exception happens!');
  console.log(err);
  console.trace(err);
  process.exit(1);
});

process.on('uncaughtException', err => {
  console.log('(uncaughtException) Uncaughted Exception happens!');
  console.log(err);
  console.trace(err);
  process.exit(1);
});

app.listen();
