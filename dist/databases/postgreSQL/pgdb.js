"use strict";
exports.__esModule = true;
/** Database setup for jobly. */
var pg_1 = require("pg");
var config_1 = require("../../config/config");
var config = require("./pgConfig.json");
var pgdb = (config_1.nodeEnv === "test" || config_1.nodeEnv === "dev") ?
    new pg_1.Client({
        connectionString: "postgresql://".concat(config.username, ":").concat(config.secret, "@").concat(config.host, ":").concat(config.port, "/").concat(config.dbname)
    })
    :
        new pg_1.Client({
            connectionString: "postgresql://".concat(config.username, ":").concat(config.secret, "@").concat(config.host, ":").concat(config.port, "/").concat(config.dbname),
            ssl: {
                rejectUnauthorized: false
            }
        });
pgdb.connect();
exports["default"] = pgdb;
//# sourceMappingURL=pgdb.js.map