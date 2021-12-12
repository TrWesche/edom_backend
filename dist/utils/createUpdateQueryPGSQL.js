"use strict";
/**
 * Generate a selective update query based on a request body:
 *
 * - table: where to make the query
 * - items: an object with keys of columns you want to update and values with updated values
 * - key: the column that we query by (e.g. username, handle, id)
 * - id: current record ID
 *
 * Returns object containing a DB query as a string, and array of
 * string values to be updated
 *
 */
exports.__esModule = true;
function createUpdateQueryPGSQL(table, items, key, id) {
    // keep track of item indexes
    // store all the columns we want to update and associate with vals
    var idx = 1;
    var columns = [];
    // filter out keys that start with "_" -- we don't want these in DB
    for (var key_1 in items) {
        if (key_1.startsWith("_")) {
            delete items[key_1];
        }
    }
    for (var column in items) {
        columns.push("".concat(column, "=$").concat(idx));
        idx += 1;
    }
    // build query
    var cols = columns.join(", ");
    var query = "UPDATE ".concat(table, " SET ").concat(cols, " WHERE ").concat(key, "=$").concat(idx, " RETURNING *");
    var values = Object.values(items);
    values.push(id);
    return { query: query, values: values };
}
exports["default"] = createUpdateQueryPGSQL;
//# sourceMappingURL=createUpdateQueryPGSQL.js.map