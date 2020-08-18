import 'dotenv/config';
import Server from './server';

const server = new Server();

// Hack to make app wait for db connection before starting
async function startApp() {
  await server.init();
  // server.startApp();
}

startApp();

export default server;
