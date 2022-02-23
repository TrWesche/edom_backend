// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../../utils/expresError";

// Schema Imports
import validateUserRoomCreateSchema, { UserRoomCreateProps } from "../../schemas/room/userRoomCreateSchema";
import validateUserRoomUpdateSchema, { UserRoomUpdateProps } from "../../schemas/room/userRoomUpdateSchema";

// Model Imports
import RoomModel from "../../models/roomModel";
import EquipModel from "../../models/equipModel";

// Middleware Imports
import authMW from "../../middleware/authorizationMW";


const userRoomRouter = express.Router();

/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/13/2022
userRoomRouter.post("/create", authMW.defineSitePermissions(["read_room_self", "create_room_self"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        const reqValues: UserRoomCreateProps = {
            name: req.body.name,
            category_id: req.body.category_id,
            headline: req.body.headline,
            description: req.body.description,
            public: req.body.public
        };

        if (!req.user?.id) {
            throw new ExpressError(`Must be logged in to create rooms`, 400);
        };

        if(!validateUserRoomCreateSchema(reqValues)) {
            throw new ExpressError(`Unable to Create User Room: ${validateUserRoomCreateSchema.errors}`, 400);
        };

        // Processing
        const queryData = await RoomModel.create_user_room(req.user.id, reqValues);
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
// Manual Test - Basic Functionality: 01/13/2022
userRoomRouter.get("/list", authMW.defineSitePermissions(["read_room_self"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id) {
            throw new ExpressError("Invalid Call: Get User Rooms - All", 401);
        };

        // Processing
        const queryData = await RoomModel.retrieve_user_rooms_by_user_id_all(req.user?.id);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get User Rooms - All", 404);
        };
        
        return res.json({rooms: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/19/2022
// Get List of Equipment Assigned to a Particular Room
userRoomRouter.get("/:roomID/equips", authMW.defineSitePermissions(["read_room_self", "read_equip_self"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        //TODO: Need to modify to ensure data security.
        const queryData = await EquipModel.retrieve_room_equip_by_room_id(req.params.roomID);
        if (!queryData) {
            throw new ExpressError("Room Not Found.", 404);
        }
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/13/2022
userRoomRouter.get("/:roomID", authMW.defineSitePermissions(["read_room_self"]), authMW.validatePermissions, async (req, res, next) => {
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
// Manual Test - Basic Functionality: 01/13/2022
userRoomRouter.patch("/:roomID", authMW.defineSitePermissions(["read_room_self", "update_room_self"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        const prevValues = await RoomModel.retrieve_room_by_room_id(req.params.roomID);
        if (!prevValues) {
            throw new ExpressError(`Update Failed: Room Not Found`, 404);
        };

        const updateValues: UserRoomUpdateProps = {
            name: req.body.name,
            category_id: req.body.category_id,
            headline: req.body.headline,
            description: req.body.description,
            public: req.body.public
        };

        if(!validateUserRoomUpdateSchema(updateValues)) {
            throw new ExpressError(`Update Error: ${validateUserRoomUpdateSchema.errors}`, 400);
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
        const newData = await RoomModel.modify_user_room(req.params.roomID, itemsList);
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
// Manual Test - Basic Functionality: 01/15/2022
userRoomRouter.delete("/:roomID", authMW.defineSitePermissions(["read_room_self", "delete_room_self"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        if (!req.user?.id) {
            throw new ExpressError(`Must be logged in to delete rooms`, 400);
        }

        const queryData = RoomModel.delete_user_room(req.user.id, req.params.roomID);
        if(!queryData) {
            throw new ExpressError("Unable to delete target room", 404);
        }

        return res.json({message: "Room deleted."});
    } catch (error) {
        return next(error);
    }
});

export default userRoomRouter;