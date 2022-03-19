// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Schema Imports
import validateGroupEquipCreateSchema, { GroupEquipCreateProps } from "../../../schemas/equipment/groupEquipCreateSchema";
import validateGroupEquipUpdateSchema, { GroupEquipUpdateProps } from "../../../schemas/equipment/groupEquipUpdateSchema";

// Model Imports
import EquipModel from "../../../models/equipModel";

// Middleware Imports
import authMW from "../../../middleware/authorizationMW";


const groupEquipRouter = express.Router();


/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/18/2022
// groupEquipRouter.post("/", authMW.defineGroupPermissions(["read_equip", "create_equip"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         console.log("Start Create Group Equip");

//         // Preflight
//         const reqValues: GroupEquipCreateProps = {
//             name: req.body.name,
//             category_id: req.body.category_id,
//             headline: req.body.headline,
//             description: req.body.description,
//             public: req.body.public,
//             configuration: req.body.configuration
//         }

//         if (!req.user?.id || !req.groupID) {
//             throw new ExpressError(`Must be logged in to create equipment || group not found`, 400);
//         }

//         if(!validateGroupEquipCreateSchema(reqValues)) {
//             console.log(validateGroupEquipCreateSchema.errors);
//             throw new ExpressError(`Unable to Create Group Equipment: ${validateGroupEquipCreateSchema.errors}`, 400);
//         }

//         // Process
//         const queryData = await EquipModel.create_group_equip(req.groupID, reqValues);
//         if (!queryData) {
//             throw new ExpressError("Create Equipment Failed", 400);
//         }
        
//         return res.json({equip: [queryData]})
//     } catch (error) {
//         next(error)
//     }
// });

// Manual Test - Basic Functionality: 01/19/2022
// Create Room - Equipment Association
groupEquipRouter.post("/:equipID/rooms", authMW.defineGroupPermissions(["read_room", "update_room", "read_equip", "update_equip"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        console.log("Start Create Association: Group Room -> Equipment");
        // Preflight
        if (!req.user?.id || !req.groupID || !req.body.roomID) {
            throw new ExpressError(`Must be logged in to create rooms / Missing Group Definition / Target Equip ID not provided`, 400);
        };

        // Validate Group Ownership of Target Equipment
        const equipCheck = await EquipModel.retrieve_equip_by_group_and_equip_id(req.groupID, req.params.equipID);
        if (!equipCheck.id) {
            throw new ExpressError(`This piece of equipment is not associated with the target group`, 401);
        };

        // Check that Equip has not already been associated with another room.
        const asscRooms = await EquipModel.retrieve_equip_rooms_by_equip_id(req.params.equipID);
        if (asscRooms.length > 0) {
            throw new ExpressError("This piece of equipment is already associated with a room, a piece of equipment can only be associated with one room.", 400);
        };

        // Processing
        const queryData = await EquipModel.create_equip_room_association(req.body.roomID, req.params.equipID);
        if (!queryData) {
            throw new ExpressError("Create Group Room -> Equip Association Failed", 500);
        };

        return res.json({roomEquip: [queryData]});
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
// Manual Test - Basic Functionality: 01/18/2022
groupEquipRouter.get("/list", authMW.defineGroupPermissions(["read_equip"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.groupID) {
            throw new ExpressError("Invalid Call: Get Group Equipment - All", 401);
        };

        // Processing
        const queryData = await EquipModel.retrieve_group_equip_by_group_id(req.groupID);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get User Equipment - All", 404);
        };
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/19/2022
groupEquipRouter.get("/:equipID/rooms", authMW.defineGroupPermissions(["read_room", "read_equip"]), authMW.validatePermissions, async (req, res, next) => {
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

// Manual Test - Basic Functionality: 01/18/2022
groupEquipRouter.get("/:equipID", authMW.defineGroupPermissions(["read_equip"]), authMW.validatePermissions, async (req, res, next) => {
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
// Manual Test - Basic Functionality: 01/18/2022
groupEquipRouter.patch("/:equipID", authMW.defineGroupPermissions(["read_equip", "update_equip"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to update equipment || group not found`, 400);
        }

        const prevValues = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID);
        if (!prevValues) {
            throw new ExpressError(`Update Failed: Equipment Not Found`, 404);
        };

        const updateValues: GroupEquipUpdateProps = {
            name: req.body.name,
            category_id: req.body.category_id,
            headline: req.body.headline,
            description: req.body.description,
            public: req.body.public,
            configuration: req.body.configuration
        };

        if(!validateGroupEquipUpdateSchema(updateValues)) {
            throw new ExpressError(`Update Error: ${validateGroupEquipUpdateSchema.errors}`, 400);
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
// Manual Test - Basic Functionality: 01/18/2022
groupEquipRouter.delete("/:equipID", authMW.defineGroupPermissions(["read_equip", "delete_equip"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to create equipment || group not found`, 400);
        }
        
        const queryData = EquipModel.delete_group_equip(req.groupID, req.params.equipID);
        if(!queryData) {
            throw new ExpressError("Unable to delete target equipment", 404);
        }

        return res.json({message: "Equipment deleted."});
    } catch (error) {
        return next(error);
    }
});

// Manual Test - Basic Functionality: 01/19/2022
groupEquipRouter.delete("/:equipID/rooms", authMW.defineGroupPermissions(["read_room", "update_room", "read_equip", "update_equip"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        console.log("Start Delete Association: Group Room -> Equipment");
        // Preflight
        if (!req.user?.id || !req.groupID || !req.body.roomID) {
            throw new ExpressError(`Must be logged in to create rooms / Missing Group Definition / Target Equip ID not provided`, 400);
        };

        // Validate Group Ownership of Target Equipment
        const equipCheck = await EquipModel.retrieve_equip_by_group_and_equip_id(req.groupID, req.params.equipID);
        if (!equipCheck.id) {
            throw new ExpressError(`This piece of equipment is not associated with the target group`, 401);
        };

        // Processing
        const queryData = await EquipModel.delete_equip_room_assc_by_room_equip_id(req.body.roomID, req.params.equipID);
        if (!queryData) {
            throw new ExpressError("Delete Group Room -> Equip Association Failed", 500);
        };

        return res.json({roomEquip: [queryData]});
    } catch (error) {
        next(error);
    };
});

export default groupEquipRouter;