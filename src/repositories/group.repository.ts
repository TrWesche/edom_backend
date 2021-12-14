import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface GroupObjectProps {
    id?: string,
    name?: string,
    description?: string,
    public?: boolean
}


class GroupRepo {
    static async create_new_group(groupData: GroupObjectProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO groups 
                    (name, description, public) 
                VALUES ($1, $2, $3) 
                RETURNING id, name, description, public`,
            [
                groupData.name,
                groupData.description,
                groupData.public
            ]);
            
            const rval: GroupObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new group - ${error}`, 500);
        }
    };
    

    static async fetch_group_by_group_id(groupID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name, 
                        description,
                        public
                  FROM groups
                  WHERE id = $1`,
                  [groupID]
            );
    
            const rval: GroupObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate group - ${error}`, 500);
        };
    };
    

    static async update_group_by_group_id(groupID: string, groupData: GroupObjectProps) {
        try {
            // Parital Update: table name, payload data, lookup column name, lookup key
            let {query, values} = createUpdateQueryPGSQL(
                "groups",
                groupData,
                "id",
                groupID
            );
    
            const result = await pgdb.query(query, values);

            const rval: GroupObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update group - ${error}`, 500);
        }
    };
    
    
    static async delete_group_by_group_id(groupID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM groups
                WHERE id = $1
                RETURNING id`,
            [groupID]);
    
            const rval: GroupObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group - ${error}`, 500);
        }
    };
}


export default GroupRepo;