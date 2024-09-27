import mysql,{ Pool} from 'mysql2/promise';

let globalPool: Pool | undefined = undefined;

export default function connect(): Pool {

  // If the pool was already created, return it instead of creating a new one.
  if(typeof globalPool !== 'undefined') {
    return globalPool;
  }

  // If we have gotten this far, the pool doesn't exist, so lets create one.
  globalPool =mysql.createPool({
    host: process.env.MYSQL_HOST,       // Your MySQL host
    port: parseInt(process.env.MYSQL_PORT!),       // Your MySQL port
    user: process.env.MYSQL_USERNAME,   // Your MySQL username
    password: process.env.MYSQL_PASSWORD, // Your MySQL password
    database: process.env.MYSQL_DATABASE, // Your MySQL database name
  });
  return globalPool;
}
