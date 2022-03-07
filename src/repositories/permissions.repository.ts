import ExpressError from "../utils/expresError";
import pgdb from "../databases/postgreSQL/pgdb";

export interface RoutePermissions {
    user?: Array<string>
    group?: Array<string>
    public?: Array<string>
}

class PermissionsRepo {
    static async fetch_permissions_by_user_id(userID: string) {
        try {
            const result = await pgdb.query(
                `SELECT * FROM get_user_permissions($1)`,
                    [userID]
            );

            return result.rows;
        } catch (error) {
            // console.log(error);
            throw new ExpressError(`An Error Occured: Unable to get user permissions for the target user - ${error}`, 500);
        }  
    };

    // static async fetch_site_permissions(userID: string, permList: Array<string>) {
    //     try {
    //         const filterList = permList.join(",");

    //         // ,
    //         // user_siteroles.user_id AS user_id

    //         const result = await pgdb.query(
    //             `SELECT DISTINCT
    //                 sitepermissions.name AS permissions_name
    //             FROM users
    //             LEFT JOIN user_siteroles ON user_siteroles.user_id = users.id 
    //             LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
    //             LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
    //             LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
    //             WHERE users.id = $1 AND sitepermissions.name IN ($2)
    //             `,
    //                 [userID, filterList]
    //         );

    //         return result.rows;
    //     } catch (error) {
    //         // console.log(error);
    //         throw new ExpressError(`An Error Occured: Unable to get user group permissions for the target equip - ${error}`, 500);
    //     }  
    // };

    // static async fetch_group_permissions(userID: string, groupID: string, permList: Array<string>) {
    //     try {
    //         const filterList = permList.join(",");

    //         // ,
    //         //         user_grouproles.user_id AS user_id,
    //         //         groups.id AS group_id

    //         const result = await pgdb.query(
    //             `SELECT DISTINCT
    //                 grouppermissions.name AS permissions_name
    //             FROM groups
    //             LEFT JOIN grouproles ON grouproles.group_id = groups.id 
    //             LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
    //             LEFT JOIN users ON users.id = user_grouproles.user_id
    //             LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id 
    //             LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id
    //             WHERE users.id = $1 AND groups.id = $2 AND grouppermissions.name IN ($3)            
    //             `,
    //                 [userID, groupID, filterList]
    //         );

    //         return result.rows;
    //     } catch (error) {
    //         // console.log(error);
    //         throw new ExpressError(`An Error Occured: Unable to get user group permissions for the target equip - ${error}`, 500);
    //     }  
    // };

    // static async fetch_equip_permissions_group(userID: string, equipID: string, permList: Array<string>) {
    //     try {
    //         const filterList = permList.join(",");

    //         // ,
    //         //         user_grouproles.user_id AS user_id,
    //         //         groups.id AS group_id,
    //         //         equipment.id AS equipment_id

    //         const result = await pgdb.query(
    //             `SELECT DISTINCT
    //                 grouppermissions.name AS permissions_name
    //             FROM equipment
    //             LEFT JOIN group_equipment ON group_equipment.equip_id = equipment.id -- I want the group that is associated with this piece of equipment
    //             LEFT JOIN groups ON groups.id = group_equipment.group_id -- So I can determine
    //             LEFT JOIN grouproles ON grouproles.group_id = groups.id -- The role identifiers for that group
    //             LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id -- And determine which the user has
    //             LEFT JOIN users ON users.id = user_grouproles.user_id
    //             LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id -- Such that when I filter
    //             LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id -- I only see what the user has for the target equip
    //             WHERE users.id = $1 AND equipment.id = $2 AND grouppermissions.name IN ($3)
    //             `,
    //                 [userID, equipID, filterList]
    //         );

    //         return result.rows;
    //     } catch (error) {
    //         // console.log(error);
    //         throw new ExpressError(`An Error Occured: Unable to get user group permissions for the target equip - ${error}`, 500);
    //     }  
    // };

    // static async fetch_equip_permissions_user(userID: string, equipID: string, permList: Array<string>) {
    //     try {
    //         const filterList = permList.join(",");
    //         // ,
    //         // user_siteroles.user_id AS user_id,
    //         // equipment.id AS equipment_id

    //         const result = await pgdb.query(
    //             `SELECT DISTINCT
    //                 sitepermissions.name AS permissions_name
    //             FROM equipment
    //             LEFT JOIN user_equipment ON user_equipment.equip_id = equipment.id 
    //             LEFT JOIN users ON users.id = user_equipment.user_id
    //             LEFT JOIN user_siteroles ON user_siteroles.user_id = users.id 
    //             LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
    //             LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
    //             LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
    //             WHERE users.id = $1 AND equipment.id = $2 AND sitepermissions.name IN ($3)
    //             `,
    //                 [userID, equipID, filterList]
    //         );

    //         return result.rows;
    //     } catch (error) {
    //         // console.log(error);
    //         throw new ExpressError(`An Error Occured: Unable to get user permissions for the target equip - ${error}`, 500);
    //     }  
    // };

    static async fetch_user_equip_permissions(userID: string, equipID: string, permissions: RoutePermissions) {
        try {
            const permListUser = permissions.user ? permissions.user : ["NotApplicable"];
            const permListGroup = permissions.group ? permissions.group : ["NotApplicable"];
            const permListPublic = permissions.public ? permissions.public : ["NotApplicable"];

            const result = await pgdb.query(
                `SELECT * FROM retrieve_user_auth_for_equipment($1, $2, $3, $4, $5)`,
                [userID, equipID, permListGroup, permListUser, permListPublic]
            )


            // const result = await pgdb.query(
            //         `SELECT DISTINCT
            //             grouppermissions.name AS permissions_name
            //         FROM equipment
            //         LEFT JOIN group_equipment ON group_equipment.equip_id = equipment.id
            //         LEFT JOIN groups ON groups.id = group_equipment.group_id
            //         LEFT JOIN grouproles ON grouproles.group_id = groups.id
            //         LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
            //         LEFT JOIN users ON users.id = user_grouproles.user_id
            //         LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id
            //         LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id
            //         WHERE users.id = $1 AND equipment.id = $2 AND grouppermissions.name IN ($3)
            //         UNION
            //         SELECT DISTINCT
            //             sitepermissions.name AS permissions_name
            //         FROM equipment
            //         LEFT JOIN user_equipment ON user_equipment.equip_id = equipment.id 
            //         LEFT JOIN users ON users.id = user_equipment.user_id
            //         LEFT JOIN user_siteroles ON user_siteroles.user_id = users.id 
            //         LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
            //         LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
            //         LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
            //         WHERE users.id = $1 AND equipment.id = $2 AND sitepermissions.name IN ($4)
            //     `,
            //         [userID, equipID, permListGroup, permListUser]
            // );

            return result.rows;
        } catch (error) {
            // console.log(error);
            throw new ExpressError(`An Error Occured: Unable to get user permissions for the target equip - ${error}`, 500);
        } 
    };

    static async fetch_user_room_permissions(userID: string, roomID: string, permissions: RoutePermissions) {
        try {
            const permListUser = permissions.user ? permissions.user : ["NotApplicable"];
            const permListGroup = permissions.group ? permissions.group : ["NotApplicable"];
            const permListPublic = permissions.public ? permissions.public : ["NotApplicable"];

            const result = await pgdb.query(
                `SELECT * FROM retrieve_user_auth_for_room($1, $2, $3, $4, $5)`,
                [userID, roomID, permListGroup, permListUser, permListPublic]
            )

            return result.rows;
        } catch (error) {
            // console.log(error);
            throw new ExpressError(`An Error Occured: Unable to get user permissions for the target room - ${error}`, 500);
        } 
    };

    static async fetch_user_group_permissions(userID: string, groupID: string, permissions: RoutePermissions) {
        try {
            const permListGroup = permissions.group ? permissions.group : ["NotApplicable"];
            const permListPublic = permissions.public ? permissions.public : ["NotApplicable"];

            const result = await pgdb.query(
                `SELECT * FROM retrieve_user_auth_for_group($1, $2, $3, $4)`,
                [userID, groupID, permListGroup, permListPublic]
            )

            return result.rows;
        } catch (error) {
            // console.log(error);
            throw new ExpressError(`An Error Occured: Unable to get user permissions for the target room - ${error}`, 500);
        } 
    };

    // static async fetch_room_permissions_group(userID: string, roomID: string, permList: Array<string>) {
    //     try {
    //         const filterList = permList.join(",");
    //         // ,
    //         // user_grouproles.user_id AS user_id,
    //         // groups.id AS group_id,
    //         // rooms.id AS room_id

    //         const result = await pgdb.query(
    //             `SELECT DISTINCT
    //                 grouppermissions.name AS permissions_name
    //             FROM rooms
    //             LEFT JOIN group_rooms ON group_rooms.room_id = rooms.id
    //             LEFT JOIN groups ON groups.id = group_rooms.group_id 
    //             LEFT JOIN grouproles ON grouproles.group_id = groups.id 
    //             LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
    //             LEFT JOIN users ON users.id = user_grouproles.user_id
    //             LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id 
    //             LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id
    //             WHERE users.id = $1 AND rooms.id = $2 AND grouppermissions.name IN ($3)
    //             `,
    //                 [userID, roomID, filterList]
    //         );

    //         return result.rows;
    //     } catch (error) {
    //         // console.log(error);
    //         throw new ExpressError(`An Error Occured: Unable to get user group permissions for the target room - ${error}`, 500);
    //     }  
    // };

    // static async fetch_room_permissions_user(userID: string, roomID: string, permList: Array<string>) {
    //     try {
    //         const filterList = permList.join(",");
    //         // ,
    //         // user_siteroles.user_id AS user_id,
    //         // rooms.id AS room_id

    //         const result = await pgdb.query(
    //             `SELECT DISTINCT
    //                 sitepermissions.name AS permissions_name
    //             FROM rooms
    //             LEFT JOIN user_rooms ON user_rooms.room_id = rooms.id 
    //             LEFT JOIN users ON users.id = user_rooms.user_id
    //             LEFT JOIN user_siteroles ON user_siteroles.user_id = users.id 
    //             LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
    //             LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
    //             LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
    //             WHERE users.id = $1 AND rooms.id = $2 AND sitepermissions.name IN ($3)
    //             `,
    //                 [userID, roomID, filterList]
    //         );

    //         return result.rows;
    //     } catch (error) {
    //         // console.log(error);
    //         throw new ExpressError(`An Error Occured: Unable to get user permissions for the target room - ${error}`, 500);
    //     }  
    // };

}


export default PermissionsRepo;