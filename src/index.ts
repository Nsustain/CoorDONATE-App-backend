import express from 'express';
import bodyParser from 'body-parser';
// eslint-disable-next-line import/extensions, node/no-missing-import
import AppDataSource from './config/ormconfig';

require('dotenv').config();

const app = express();
app.use(bodyParser);
const port = parseInt(process.env.PORT || '4000', 10);

AppDataSource.initialize()
  .then(() => {
    console.log('database connected');
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(port, () => {
  console.log('Server Running at port 5000');
});
