// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Schema Imports
import validateCreateRobotSchema, { RobotCreateProps } from "../schemas/robot/robotCreateSchema";

// Model Imports
import RobotModel from "../models/robotModel";

// Middleware Imports
import { ensureLoggedIn, validatePermissions } from "../middleware/authorizationMW";
import validateUpdateRobotSchema, { RobotUpdateProps } from "../schemas/robot/robotUpdateSchema";


const robotRouter = express.Router();


/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/

robotRouter.post("/create", ensureLoggedIn, async (req, res, next) => {
    try {
        const regValues: RobotCreateProps = {
            name: req.body.name,
            description: req.body.description,
            public: req.body.public,
            config: req.body.config
        }

        if(!validateCreateRobotSchema(regValues)) {
            throw new ExpressError(`Username & Password Required: ${validateCreateRobotSchema.errors}`, 400);
        }

        const queryData = await RobotModel.create(regValues);
        if (!queryData) {
            throw new ExpressError("Create Robot Failed", 400);
        }
        
        return res.json({robot: queryData})
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

robotRouter.get("/:robotID", ensureLoggedIn, async (req, res, next) => {
    try {
        const queryData = await RobotModel.retrieve_robot_by_robot_id(req.params.robotID);
        if (!queryData) {
            throw new ExpressError("Robot Not Found.", 404);
        }
        
        return res.json({robot: queryData});
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

robotRouter.patch("/:robotID", validatePermissions, async (req, res, next) => {
    try {
        const prevValues = await RobotModel.retrieve_robot_by_robot_id(req.params.robotID);
        if (!prevValues) {
            throw new ExpressError(`Update Failed: Robot Not Found`, 404);
        };

        const updateValues: RobotUpdateProps = {
            name: req.body.name,
            description: req.body.description,
            public: req.body.public,
            config: req.body.config
        };

        if(!validateUpdateRobotSchema(updateValues)) {
            throw new ExpressError(`Update Error: ${validateUpdateRobotSchema.errors}`, 400);
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
            return res.json({robot: prevValues});
        }

        // Update the user data with the itemsList information
        const newData = await RobotModel.modify_robot(req.params.robotID, itemsList);
        return res.json({robot: newData})
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

robotRouter.delete("/:robotID", validatePermissions, async (req, res, next) => {
    try {
        const queryData = RobotModel.delete_robot(req.params.robotID);
        if(!queryData) {
            throw new ExpressError("Unable to delete target robot", 404);
        }

        return res.json({message: "Robot deleted."});
    } catch (error) {
        return next(error);
    }
})