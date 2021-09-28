import express from 'express';
import cors from 'cors';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// form submision woul dnot require a pre-flight check
// however json submission would
app.options('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Length, X-Requested-With'
  );
  res.send(200);
});

// middleware
// funcs applied to (all) routes
// urlencoded - for form request
app.use((req, res, next) => {
  console.log(`Header: ${req.header}\tPath: ${req.path}\nip: ${req.ip}\n\n`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// for css and other static assets
app.use(express.static('public'));
app.use(express.static('css'));

// routes
// app.use('/routes/time', timeRoutes);
// app.use("/routes/name", nameRoutes);
// app.use("/routes/json", jsonRoutes);
// app.use("/routes/echo-all", echoAllRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './views/index.html'));
});

app.get('/form', (req, res) => {
  res.sendFile(path.resolve(__dirname, './views/form.html'));
});

app.get('/:word/echo', (req, res) => {
  res.json({ echo: req.params.word });
});

app.all('*', (req, res) => {
  res.send('Invalid route');
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
