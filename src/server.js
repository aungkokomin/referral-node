const express = require('express');
const router = require('core/http/router');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/', router);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;