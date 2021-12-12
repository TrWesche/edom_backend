/** Database setup for jobly. */
import { Client } from "pg";
import { nodeEnv } from "../../config/config";
import * as config from "./pgConfig.json";


const pgdb = (nodeEnv === "test" || nodeEnv === "dev") ? 
  new Client({
    connectionString: `postgresql://${config.username}:${config.secret}@${config.host}:${config.port}/${config.dbname}`
  })
  :
  new Client({
    connectionString: `postgresql://${config.username}:${config.secret}@${config.host}:${config.port}/${config.dbname}`,
    ssl: {
      rejectUnauthorized: false
    }
  });

pgdb.connect();

export default pgdb;
