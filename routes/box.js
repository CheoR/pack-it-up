import express from 'express';

const router = express.Router();

const boxReply = (req, res) => {
  /*
    GET and POST request have a different way of getting the
    parameters.

    Provide reply based on the accept headers. That is when
    the request is sent from the frontend from the client/browser
    and it says which is will accept, json or text, in return.
  */
  const firstName = req.method === 'GET' ? req.query.first : req.body.first;
  const lastName = req.method === 'GET' ? req.query.last : req.body.last;

  /*
    check whic format return accepts
  */
  res.format({
    'text/plain': () => {
      res.send(`name: ${firstName} ${lastName}`);
    },
    'test/html': () => {
      const html = `<ul><<li>name: ${firstName} ${lastName}</li>/ul>`;
      res.send(html);
    },
    'application/json': () => {
      res.json({ name: `${firstName} ${lastName}` });
    },
    default: () => {
      res.status(406).send('Not Acceptable');
    },
  });
};

router.route('/')
  .get(boxReply)
  .post(boxReply);

export default router;
