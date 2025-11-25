const express = require('express');
const app = express();
const port = 5000;
const host = '0.0.0.0';

app.get('/', (req, res) => {
  res.send('Hello from Jenkins → ECR → EC2 CI/CD Pipeline (Node Express)!');
});

app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}`);
});