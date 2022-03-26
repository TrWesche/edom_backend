// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../../utils/expresError";

// Model Imports
import EquipModel from "../../models/equipModel";

// Middleware Imports
import authMW from "../../middleware/authorizationMW";


const userEquipRouter = express.Router();


// Manual Test - Basic Functionality: 01/20/2022
// userEquipRouter.post("/:equipID/rooms", authMW.defineSitePermissions(["read_equip_self", "update_equip_self", "update_room_self"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         // Preflight
//         if (!req.user?.id || !req.body.roomID) {
//             throw new ExpressError(`Must be logged in to create rooms / Target Room ID not provided`, 400);
//         };

//         // Validate Group Ownership of Target Equipment
//         const equipCheck = await EquipModel.retrieve_equip_by_user_and_equip_id(req.user.id, req.params.equipID);
//         if (!equipCheck.id) {
//             throw new ExpressError(`This piece of equipment is not associated with the target user`, 401);
//         };

//         // Check that Equip has not already been associated with another room.
//         // const asscRooms = await EquipModel.retrieve_equip_rooms_by_equip_id(req.params.equipID);
//         // if (asscRooms.length > 0) {
//         //     throw new ExpressError("This piece of equipment is already associated with a room, a piece of equipment can only be associated with one room.", 400);
//         // };

//         // Processing
//         const queryData = await EquipModel.create_equip_room_association(req.body.roomID, req.params.equipID);
//         if (!queryData) {
//             throw new ExpressError("Assoicate Equipment to Room Failed", 500);
//         };
        
//         return res.json({roomEquip: [queryData]});
//     } catch (error) {
//         next(error);
//     }
// });


// Manual Test - Basic Functionality: 01/19/2022
// userEquipRouter.delete("/:equipID/rooms", authMW.defineSitePermissions(["read_equip_self", "update_equip_self", "update_room_self"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         // Preflight
//         if (!req.user?.id || !req.body.roomID) {
//             throw new ExpressError(`Must be logged in to create rooms / Missing Group Definition / Target Equip ID not provided`, 400);
//         };

//         // Validate Group Ownership of Target Equipment
//         const equipCheck = await EquipModel.retrieve_equip_by_user_and_equip_id(req.user.id, req.params.equipID);
//         if (!equipCheck.id) {
//             throw new ExpressError(`This piece of equipment is not associated with the target user`, 401);
//         };

//         // Processing
//         const queryData = await EquipModel.delete_equip_room_assc_by_room_equip_id(req.body.roomID, req.params.equipID);
//         if (!queryData) {
//             throw new ExpressError("Disassociate Equipment from Room Failed", 500);
//         };
        
//         return res.json({roomEquip: [queryData]});
//     } catch (error) {
//         next(error);
//     }
// });

// export default userEquipRouter;