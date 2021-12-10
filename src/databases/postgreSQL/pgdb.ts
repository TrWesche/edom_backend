/** Database setup for jobly. */
import { Client } from "pg";
import { nodeEnv, pgDBURI } from "../../config/config";


const pgdb = (nodeEnv === "test" || nodeEnv === "dev") ? 
  new Client({
    connectionString: pgDBURI
  })
  :
  new Client({
    connectionString: pgDBURI,
    ssl: {
      rejectUnauthorized: false
    }
  });

pgdb.connect();

export default pgdb;
