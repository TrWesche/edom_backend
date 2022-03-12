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



////  CURRENT UNFINISHED!!  LEFT PARTIALLY COMPLETED IN CASE A NEW PURPOSE FOR FINISHING THIS COMES UP LATER


function createUpdateTransaction(data: Array<Object>, key: string, id: string) {
    // keep track of item indexes
    // store all the columns we want to update and associate with vals
    let idx: number = 1;
    let columns: Array<string> = [];
    let querys: Array<string> = [];

    // let table: keyof typeof data;
    let group: any; 
    let item: any;
    // let column: keyof typeof table;

    for (group in data) {
        if (group["_tableid"] !== undefined && group["_filtercolumn"] !== undefined && group["_filtervalue"] !== undefined) {
            // Populate Query Columns & Indexs
            columns = [];
            for (item in group) {
                if (!key.startsWith("_")) {
                    columns.push(`${item}=$${idx}`);
                    idx += 1;
                };
            };

            // Build Sub-Query
            querys.push(`UPDATE ${group["_tableid"]} SET ${columns.join(", ")} WHERE ${group["_filtercolumn"]}=${group["_filtervalue"]}`)
        }
    }

  
    // build query
    // let cols = columns.join(", ");
    // let query = `UPDATE ${table} SET ${cols} WHERE ${key}=$${idx} RETURNING *`;
  
    // let values = Object.values(items);
    // values.push(id);
  
    // return {query, values};
}
  
  
export default createUpdateTransaction;
  