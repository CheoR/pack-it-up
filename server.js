const path = require('path');
const jsonServer = require('json-server');
const PORT = process.env.REACT_APP_API || 3000;

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, './api/heroku_db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

server.listen(PORT, () => {
 console.log('Server running . . ');
});
