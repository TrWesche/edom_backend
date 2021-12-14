import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface GroupPermObjectProps {
    id?: string,
    name?: string
}


class GroupPermRepo {
    static async create_new_group_perm(groupPermData: GroupPermObjectProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO groupPermissions
                    (name) 
                VALUES ($1) 
                RETURNING id, name`,
            [
                groupPermData.name,
            ]);
            
            const rval: GroupPermObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new group permission - ${error}`, 500);
        }
    };
    

    static async fetch_group_perm_by_group_perm_id(groupPermID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name
                  FROM groupPermissions
                  WHERE id = $1`,
                  [groupPermID]
            );
    
            const rval: GroupPermObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate group permission - ${error}`, 500);
        };
    };
    

    static async update_group_perm_by_group_perm_id(groupPermID: string, groupPermData: GroupPermObjectProps) {
        try {
            // Parital Update: table name, payload data, lookup column name, lookup key
            let {query, values} = createUpdateQueryPGSQL(
                "groupPermissions",
                groupPermData,
                "id",
                groupPermID
            );
    
            const result = await pgdb.query(query, values);

            const rval: GroupPermObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update group permission - ${error}`, 500);
        }
    };
    
    
    static async delete_group_perm_by_group_perm_id(groupPermID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM groupPermissions
                WHERE id = $1
                RETURNING id`,
            [groupPermID]);
    
            const rval: GroupPermObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group permission - ${error}`, 500);
        }
    };
}


export default GroupPermRepo;