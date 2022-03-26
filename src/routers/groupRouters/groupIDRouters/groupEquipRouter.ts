// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Model Imports
import EquipModel from "../../../models/equipModel";

// Middleware Imports
import authMW from "../../../middleware/authorizationMW";


const groupEquipRouter = express.Router();


// Manual Test - Basic Functionality: 01/19/2022
// Create Room - Equipment Association
// groupEquipRouter.post("/:equipID/rooms", authMW.defineGroupPermissions(["read_room", "update_room", "read_equip", "update_equip"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         console.log("Start Create Association: Group Room -> Equipment");
//         // Preflight
//         if (!req.user?.id || !req.groupID || !req.body.roomID) {
//             throw new ExpressError(`Must be logged in to create rooms / Missing Group Definition / Target Equip ID not provided`, 400);
//         };

//         // Validate Group Ownership of Target Equipment
//         const equipCheck = await EquipModel.retrieve_equip_by_group_and_equip_id(req.groupID, req.params.equipID);
//         if (!equipCheck.id) {
//             throw new ExpressError(`This piece of equipment is not associated with the target group`, 401);
//         };

//         // Check that Equip has not already been associated with another room.
//         // const asscRooms = await EquipModel.retrieve_equip_rooms_by_equip_id(req.params.equipID);
//         // if (asscRooms.length > 0) {
//         //     throw new ExpressError("This piece of equipment is already associated with a room, a piece of equipment can only be associated with one room.", 400);
//         // };

//         // Processing
//         const queryData = await EquipModel.create_equip_room_association(req.body.roomID, req.params.equipID);
//         if (!queryData) {
//             throw new ExpressError("Create Group Room -> Equip Association Failed", 500);
//         };

//         return res.json({roomEquip: [queryData]});
//     } catch (error) {
//         next(error);
//     };
// });


/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/
// Manual Test - Basic Functionality: 01/18/2022
// groupEquipRouter.get("/list", authMW.defineGroupPermissions(["read_equip"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         // Preflight
//         if (!req.groupID) {
//             throw new ExpressError("Invalid Call: Get Group Equipment - All", 401);
//         };

//         // Processing
//         const queryData = await EquipModel.retrieve_group_equip_by_group_id(req.groupID);
//         if (!queryData) {
//             throw new ExpressError("Equipment Not Found: Get User Equipment - All", 404);
//         };
        
//         return res.json({equip: queryData});
//     } catch (error) {
//         next(error)
//     }
// });


// Manual Test - Basic Functionality: 01/19/2022
// groupEquipRouter.delete("/:equipID/rooms", authMW.defineGroupPermissions(["read_room", "update_room", "read_equip", "update_equip"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         console.log("Start Delete Association: Group Room -> Equipment");
//         // Preflight
//         if (!req.user?.id || !req.groupID || !req.body.roomID) {
//             throw new ExpressError(`Must be logged in to create rooms / Missing Group Definition / Target Equip ID not provided`, 400);
//         };

//         // Validate Group Ownership of Target Equipment
//         const equipCheck = await EquipModel.retrieve_equip_by_group_and_equip_id(req.groupID, req.params.equipID);
//         if (!equipCheck.id) {
//             throw new ExpressError(`This piece of equipment is not associated with the target group`, 401);
//         };

//         // Processing
//         const queryData = await EquipModel.delete_equip_room_assc_by_room_equip_id(req.body.roomID, req.params.equipID);
//         if (!queryData) {
//             throw new ExpressError("Delete Group Room -> Equip Association Failed", 500);
//         };

//         return res.json({roomEquip: [queryData]});
//     } catch (error) {
//         next(error);
//     };
// });

// export default groupEquipRouter;