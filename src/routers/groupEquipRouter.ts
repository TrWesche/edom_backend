// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Schema Imports
import validateGroupEquipCreateSchema, { GroupEquipCreateProps } from "../schemas/equipment/groupEquipCreateSchema";
import validateGroupEquipUpdateSchema, { GroupEquipUpdateProps } from "../schemas/equipment/groupEquipUpdateSchema";

// Model Imports
import EquipModel from "../models/equipModel";

// Middleware Imports
import authMW from "../middleware/authorizationMW";
import groupMW from "../middleware/groupMW";


const groupEquipRouter = express.Router();


/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/

groupEquipRouter.post("/create", groupMW.defineActionPermissions(["view", "create"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        const reqValues: GroupEquipCreateProps = {
            name: req.body.name,
            category_id: req.body.category_id,
            headline: req.body.headline,
            description: req.body.description,
            public: req.body.public,
            config: req.body.config
        }

        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to create equipment || group not found`, 400);
        }

        if(!validateGroupEquipCreateSchema(reqValues)) {
            throw new ExpressError(`Unable to Create Group Equipment: ${validateGroupEquipCreateSchema.errors}`, 400);
        }

        // Process
        const queryData = await EquipModel.create_group_equip(req.groupID, reqValues);
        if (!queryData) {
            throw new ExpressError("Create Equipment Failed", 400);
        }
        
        return res.json({equip: [queryData]})
    } catch (error) {
        next(error)
    }
});



/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/

groupEquipRouter.get("/:equipID", groupMW.defineActionPermissions(["view"]), authMW.validatePermissions, async (req, res, next) => {
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

groupEquipRouter.patch("/:equipID", groupMW.defineActionPermissions(["view", "update"]), authMW.validatePermissions, async (req, res, next) => {
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
            config: req.body.config
        };

        if(!validateGroupEquipUpdateSchema(updateValues)) {
            throw new ExpressError(`Update Error: ${validateGroupEquipUpdateSchema.errors}`, 400);
        };

        // Build update list for patch query 
        const itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if(updateValues[key] && (updateValues[key] != prevValues[key]) ) {
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

groupEquipRouter.delete("/:equipID", groupMW.defineActionPermissions(["view", "delete"]), authMW.validatePermissions, async (req, res, next) => {
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
})

export default groupEquipRouter;