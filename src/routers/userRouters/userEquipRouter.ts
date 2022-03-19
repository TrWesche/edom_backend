// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../../utils/expresError";

// Schema Imports
import validateUserEquipCreateSchema, { UserEquipCreateProps } from "../../schemas/equipment/userEquipCreateSchema";
import validateUserEquipUpdateSchema, { UserEquipUpdateProps } from "../../schemas/equipment/userEquipUpdateSchema";

// Model Imports
import EquipModel from "../../models/equipModel";

// Middleware Imports
import authMW from "../../middleware/authorizationMW";


const userEquipRouter = express.Router();


/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/15/2022
// userEquipRouter.post("/create", authMW.defineSitePermissions(["read_equip_self", "create_equip_self"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         // console.log(req.body);

//         // Preflight
//         const reqValues: UserEquipCreateProps = {
//             name: req.body.name,
//             category_id: req.body.category_id,
//             headline: req.body.headline,
//             description: req.body.description,
//             public: req.body.public,
//             configuration: req.body.configuration
//         };

//         if (!req.user?.id) {
//             throw new ExpressError(`Must be logged in to create equipment`, 400);
//         };

//         if(!validateUserEquipCreateSchema(reqValues)) {
//             throw new ExpressError(`Unable to Create User Equipment: ${validateUserEquipCreateSchema.errors}`, 400);
//         };

//         // Processing
//         const queryData = await EquipModel.create_user_equip(req.user.id, reqValues);
//         if (!queryData) {
//             throw new ExpressError("Create Equipment Failed", 400);
//         };
        
//         return res.json({equip: [queryData]});
//     } catch (error) {
//         next(error)
//     }
// });

// Manual Test - Basic Functionality: 01/20/2022
userEquipRouter.post("/:equipID/rooms", authMW.defineSitePermissions(["read_equip_self", "update_equip_self", "update_room_self"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.body.roomID) {
            throw new ExpressError(`Must be logged in to create rooms / Target Room ID not provided`, 400);
        };

        // Validate Group Ownership of Target Equipment
        const equipCheck = await EquipModel.retrieve_equip_by_user_and_equip_id(req.user.id, req.params.equipID);
        if (!equipCheck.id) {
            throw new ExpressError(`This piece of equipment is not associated with the target user`, 401);
        };

        // Check that Equip has not already been associated with another room.
        const asscRooms = await EquipModel.retrieve_equip_rooms_by_equip_id(req.params.equipID);
        if (asscRooms.length > 0) {
            throw new ExpressError("This piece of equipment is already associated with a room, a piece of equipment can only be associated with one room.", 400);
        };

        // Processing
        const queryData = await EquipModel.create_equip_room_association(req.body.roomID, req.params.equipID);
        if (!queryData) {
            throw new ExpressError("Assoicate Equipment to Room Failed", 500);
        };
        
        return res.json({roomEquip: [queryData]});
    } catch (error) {
        next(error);
    }
});



/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/
// Manual Test - Basic Functionality: 01/15/2022
userEquipRouter.get("/list", authMW.defineSitePermissions(["read_equip_self"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id) {
            throw new ExpressError("Invalid Call: Get User Equipment - All", 401);
        };

        // Processing
        const queryData = await EquipModel.retrieve_user_equip_by_user_id(req.user?.id);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get User Equipment - All", 404);
        };
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/19/2022
userEquipRouter.get("/:equipID/rooms", authMW.defineSitePermissions(["read_room_self", "read_equip_self"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // TODO: This will need to be changed to ensure data privacy
        const queryData = await EquipModel.retrieve_equip_rooms_by_equip_id(req.params.equipID);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found.", 404);
        }
        
        return res.json({rooms: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/15/2022
userEquipRouter.get("/:equipID", authMW.defineSitePermissions(["read_equip_self"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        const queryData = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found.", 404);
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
// Manual Test - Basic Functionality: 01/15/2022
userEquipRouter.patch("/:equipID", authMW.defineSitePermissions(["read_equip_self", "update_equip_self"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        const prevValues = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID);
        if (!prevValues) {
            throw new ExpressError(`Update Failed: Equipment Not Found`, 404);
        };

        const updateValues: UserEquipUpdateProps = {
            name: req.body.name,
            category_id: req.body.category_id,
            headline: req.body.headline,
            description: req.body.description,
            public: req.body.public,
            configuration: req.body.configuration
        };

        if(!validateUserEquipUpdateSchema(updateValues)) {
            throw new ExpressError(`Update Error: ${validateUserEquipUpdateSchema.errors}`, 400);
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
        const newData = await EquipModel.modify_group_equip(req.params.equipID, itemsList);
        return res.json({equip: [newData]})
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
userEquipRouter.delete("/:equipID", authMW.defineSitePermissions(["read_equip_self", "delete_equip_self"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        if (!req.user?.id) {
            throw new ExpressError(`Must be logged in to delete equipment`, 400);
        }

        // Processing
        const queryData = EquipModel.delete_user_equip(req.user.id, req.params.equipID);
        if(!queryData) {
            throw new ExpressError("Unable to delete target equipment", 404);
        }

        return res.json({message: "Equipment deleted."});
    } catch (error) {
        return next(error);
    }
});

// Manual Test - Basic Functionality: 01/19/2022
userEquipRouter.delete("/:equipID/rooms", authMW.defineSitePermissions(["read_equip_self", "update_equip_self", "update_room_self"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.body.roomID) {
            throw new ExpressError(`Must be logged in to create rooms / Missing Group Definition / Target Equip ID not provided`, 400);
        };

        // Validate Group Ownership of Target Equipment
        const equipCheck = await EquipModel.retrieve_equip_by_user_and_equip_id(req.user.id, req.params.equipID);
        if (!equipCheck.id) {
            throw new ExpressError(`This piece of equipment is not associated with the target user`, 401);
        };

        // Processing
        const queryData = await EquipModel.delete_equip_room_assc_by_room_equip_id(req.body.roomID, req.params.equipID);
        if (!queryData) {
            throw new ExpressError("Disassociate Equipment from Room Failed", 500);
        };
        
        return res.json({roomEquip: [queryData]});
    } catch (error) {
        next(error);
    }
});

// export default userEquipRouter;