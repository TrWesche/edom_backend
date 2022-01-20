// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Schema Imports
import validateGroupRoomCreateSchema, { GroupRoomCreateProps } from "../../../schemas/room/groupRoomCreateSchema";
import validateGroupRoomUpdateSchema, { GroupRoomUpdateProps } from "../../../schemas/room/groupRoomUpdateSchema";

// Model Imports
import RoomModel from "../../../models/roomModel";
import EquipModel from "../../../models/equipModel";

// Middleware Imports
import authMW from "../../../middleware/authorizationMW";


const groupRoomRouter = express.Router();

/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/19/2022
// Create Room
groupRoomRouter.post("/", authMW.defineGroupPermissions(["read_room", "create_room"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        console.log("Start Create Group Room");
        // Preflight
        const reqValues: GroupRoomCreateProps = {
            name: req.body.name,
            category_id: req.body.category_id,
            headline: req.body.headline,
            description: req.body.description,
            public: req.body.public
        };

        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to create rooms / Missing Group Definition`, 400);
        };

        if(!validateGroupRoomCreateSchema(reqValues)) {
            throw new ExpressError(`Unable to Create Group Room: ${validateGroupRoomCreateSchema.errors}`, 400);
        };

        // Processing
        const queryData = await RoomModel.create_group_room(req.groupID, reqValues);
        if (!queryData) {
            throw new ExpressError("Create Room Failed", 500);
        };

        return res.json({rooms: [queryData]});
    } catch (error) {
        next(error);
    };
});


/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/


// Manual Test - Basic Functionality: 01/19/2022
// Get Room List
groupRoomRouter.get("/list", authMW.defineGroupPermissions(["read_room"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError("Invalid Call: Get Group Rooms - All", 401);
        };

        // Processing
        const queryData = await RoomModel.retrieve_group_rooms_by_group_id_all(req.groupID);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get Group Rooms - All", 404);
        };
        
        return res.json({rooms: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/19/2022
// Get List of Equipment Assigned to a Particular Room
groupRoomRouter.get("/:roomID/equips", authMW.defineGroupPermissions(["read_room", "read_equip"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        const queryData = await EquipModel.retrieve_room_equip_by_room_id(req.params.roomID);
        if (!queryData) {
            throw new ExpressError("Room Not Found.", 404);
        }
        
        return res.json({equip: [queryData]});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/19/2022
// Get Details of an Individual Room
groupRoomRouter.get("/:roomID", authMW.defineGroupPermissions(["read_room"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        const queryData = await RoomModel.retrieve_room_by_room_id(req.params.roomID);
        if (!queryData) {
            throw new ExpressError("Room Not Found.", 404);
        }
        
        return res.json({equip: [queryData]});
    } catch (error) {
        next(error)
    }
});


/* _   _ ____  ____    _  _____ _____ 
  | | | |  _ \|  _ \  / \|_   _| ____|
  | | | | |_) | | | |/ _ \ | | |  _|  
  | |_| |  __/| |_| / ___ \| | | |___ 
   \___/|_|   |____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/19/2022
// Update Details of an Individual Room
groupRoomRouter.patch("/:roomID", authMW.defineGroupPermissions(["read_room", "update_room"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        const prevValues = await RoomModel.retrieve_room_by_room_id(req.params.roomID);
        if (!prevValues) {
            throw new ExpressError(`Update Failed: Room Not Found`, 404);
        };

        const updateValues: GroupRoomUpdateProps = {
            name: req.body.name,
            category_id: req.body.category_id,
            headline: req.body.headline,
            description: req.body.description,
            public: req.body.public
        };

        if(!validateGroupRoomUpdateSchema(updateValues)) {
            throw new ExpressError(`Update Error: ${validateGroupRoomUpdateSchema.errors}`, 400);
        };

        // Build update list for patch query 
        const itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if(updateValues[key] !== undefined && (updateValues[key] != prevValues[key]) ) {
                itemsList[key] = req.body[key];
            }
        })


        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({equip: [prevValues]});
        }

        // Update the user data with the itemsList information
        const newData = await RoomModel.modify_group_room(req.params.roomID, itemsList);
        return res.json({rooms: [newData]})
    } catch (error) {
        next(error)
    }
});


/* ____  _____ _     _____ _____ _____ 
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|  
  | |_| | |___| |___| |___  | | | |___ 
  |____/|_____|_____|_____| |_| |_____|
*/
// Manual Test - Basic Functionality: 01/19/2022
// Delete an Individual Room
groupRoomRouter.delete("/:roomID", authMW.defineGroupPermissions(["read_room", "delete_room"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to create rooms / Missing Group Definition`, 400);
        };

        // Processing
        const queryData = RoomModel.delete_group_room(req.groupID, req.params.roomID);
        if(!queryData) {
            throw new ExpressError("Unable to delete target room", 404);
        }

        return res.json({message: "Room deleted."});
    } catch (error) {
        return next(error);
    }
});



export default groupRoomRouter;