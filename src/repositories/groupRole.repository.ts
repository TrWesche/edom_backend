import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface GroupRoleProps {
    id?: string,
    group_id?: string,
    name?: string
}


class GroupRoleRepo {
    static async create_new_group_role(groupRoleData: GroupRoleProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO groupRoles
                    (name, group_id) 
                VALUES ($1, $2) 
                RETURNING id, name, group_id`,
            [
                groupRoleData.name,
                groupRoleData.group_id
            ]);
            
            const rval: GroupRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new group role - ${error}`, 500);
        }
    };
    

    static async fetch_group_role_by_group_role_id(groupRoleID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name,
                        group_id
                  FROM groupRoles
                  WHERE id = $1`,
                  [groupRoleID]
            );
    
            const rval: GroupRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate group role - ${error}`, 500);
        };
    };
    

    static async update_group_role_by_group_role_id(groupRoleID: string, groupRoleData: GroupRoleProps) {
        try {
            // Parital Update: table name, payload data, lookup column name, lookup key
            let {query, values} = createUpdateQueryPGSQL(
                "groupRoles",
                groupRoleData,
                "id",
                groupRoleID
            );
    
            const result = await pgdb.query(query, values);

            const rval: GroupRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update group role - ${error}`, 500);
        }
    };
    
    
    static async delete_group_role_by_group_role_id(groupRoleID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM groupRoles
                WHERE id = $1
                RETURNING id`,
            [groupRoleID]);
    
            const rval: GroupRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group role - ${error}`, 500);
        }
    };
}


export default GroupRoleRepo;