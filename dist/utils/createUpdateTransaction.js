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
////  CURRENT UNFINISHED!!  LEFT PARTIALLY COMPLETED IN CASE A NEW PURPOSE FOR FINISHING THIS COMES UP LATER
function createUpdateTransaction(data, key, id) {
    // keep track of item indexes
    // store all the columns we want to update and associate with vals
    var idx = 1;
    var columns = [];
    var querys = [];
    // let table: keyof typeof data;
    var group;
    var item;
    // let column: keyof typeof table;
    for (group in data) {
        if (group["_tableid"] !== undefined && group["_filtercolumn"] !== undefined && group["_filtervalue"] !== undefined) {
            // Populate Query Columns & Indexs
            columns = [];
            for (item in group) {
                if (!key.startsWith("_")) {
                    columns.push("".concat(item, "=$").concat(idx));
                    idx += 1;
                }
                ;
            }
            ;
            // Build Sub-Query
            querys.push("UPDATE ".concat(group["_tableid"], " SET ").concat(columns.join(", "), " WHERE ").concat(group["_filtercolumn"], "=").concat(group["_filtervalue"]));
        }
    }
    // build query
    // let cols = columns.join(", ");
    // let query = `UPDATE ${table} SET ${cols} WHERE ${key}=$${idx} RETURNING *`;
    // let values = Object.values(items);
    // values.push(id);
    // return {query, values};
}
exports["default"] = createUpdateTransaction;
//# sourceMappingURL=createUpdateTransaction.js.map