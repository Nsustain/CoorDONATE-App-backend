const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'rootUser',
  database: 'postgres',
});

client.connect();

client.query('Select * from users', (err: any, res: any) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err.message);
  } 

  client.end();
});
