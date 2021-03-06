// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Model Imports
import EquipModel from "../models/equipModel";

// Middleware Imports
import authMW from "../middleware/authorizationMW";

// Schema Imports
import validateEquipCreateSchema, { EquipCreateProps } from "../schemas/equipment/equipCreateSchema";
import validateEquipUpdateSchema, { EquipUpdateProps } from "../schemas/equipment/equipUpdateSchema";


const equipRootRouter = express.Router();


/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 03/19/2022
equipRootRouter.post("/create", 
    authMW.addContextToRequest,
    authMW.defineRoutePermissions({
        user: ["site_create_equip_self"],
        group: ["group_create_equip"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id) {throw new ExpressError(`Must be logged in to create equip`, 401);};

            const reqValues: EquipCreateProps = {
                context: req.body.context ? req.body.context : "user",
                ownerid: req.body.ownerid ? req.body.ownerid : req.user.id,
                name: req.body.name,
                category_id: req.body.category_id,
                headline: req.body.headline,
                description: req.body.description,
                image_url: req.body.image_url,
                public: req.body.public,
                configuration: req.body.configuration
            };

            if(!validateEquipCreateSchema(reqValues)) {
                throw new ExpressError(`Unable to Create Equip - Schema Validation Error: ${validateEquipCreateSchema.errors}`, 400);
            };

            // Processing
            let queryData;
            let permCheck;
            switch (reqValues.context) {
                case "user": 
                    permCheck = req.resolvedPerms?.reduce((acc: any, val: any) => {
                        return acc = acc || (val.permissions_name === "site_create_equip_self")
                    }, false);

                    if (permCheck) {
                        queryData = await EquipModel.create_user_equip(reqValues);
                    } else {
                        throw new ExpressError("Unauthorized", 401);
                    }
                    break;
                case "group":
                    permCheck = req.resolvedPerms?.reduce((acc: any, val: any) => {
                        return acc = acc || (val.permissions_name === "group_create_equip")
                    }, false);

                    if (permCheck) {
                        queryData = await EquipModel.create_group_equip(reqValues);
                    } else {
                        throw new ExpressError("Unauthorized", 401);
                    };
                    break;
                default:
            };

            if (!queryData) {
                throw new ExpressError("Create Equip Failed", 500);
            };
            
            return res.json({equip: queryData})
        } catch (error) {
            next(error)
        }
    }
);

/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/
// Manual Test - Basic Functionality: 03/19/2022
equipRootRouter.get("/list", 
    authMW.defineRoutePermissions({
        user: [],
        group: [],
        public: ["site_read_equip_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            const limit = typeof(req.query.limit) === "string" ? Number(req.query.limit) : 25;
            const offset = typeof(req.query.offset) === "string" ? Number(req.query.offset) : 0;
            const username = typeof(req.query.un) === "string" ? req.query.un.toLowerCase() : null;
            const gid = typeof(req.query.gid) === "string" ? req.query.gid : null;
            const catid = typeof(req.query.catid) === "string" ? req.query.catid : null;
            const search = typeof(req.query.s) === "string" ? req.query.s : null;

            // Processing
            const queryData = await EquipModel.retrieve_equip_list_paginated(limit, offset, username, gid, catid, search);
            if (!queryData) {
                throw new ExpressError("Equipment Not Found.", 404);
            }
            
            return res.json({equip: queryData});
        } catch (error) {
            next(error)
        }
    }
);

// Manual Test - Basic Functionality: 03/24/2022
equipRootRouter.get("/:equipID/room",
    authMW.defineRoutePermissions({
        user: ["site_read_equip_self", "site_read_room_self"],
        group: ["group_read_equip", "group_read_room"],
        public: ["site_read_equip_public", "site_read_room_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        if (!req.user?.id) {throw new ExpressError("User ID Not Defined", 401)};

        let queryData;

        let roomPermissions = 0; // 1 = Public, 2 = Private
        let equipPermissions = 0; // 1 = Public, 2 = Private

        req.resolvedPerms?.forEach((val: any) => {
            // Set Read Pemission Level - Equip
            if ( ((val.permissions_name === "site_read_equip_self") || (val.permissions_name === "group_read_equip"))) {
                equipPermissions = 2;
            };

            if ( val.permissions_name === "site_read_equip_public" && equipPermissions !== 2) {
                equipPermissions = 1;
            };

            // Set Read Pemission Level - Room
            if ( ((val.permissions_name === "site_read_room_self") || (val.permissions_name === "group_read_room"))) {
                roomPermissions = 2;
            };

            if ( val.permissions_name === "site_read_room_public" && equipPermissions !== 2) {
                roomPermissions = 1;
            };
        })

        if (roomPermissions === 2 && equipPermissions === 2) {
            queryData = await EquipModel.retrieve_equip_rooms_by_equip_id([req.params.equipID], "full");
        } else 
        if (roomPermissions === 1 && equipPermissions === 2) {
            queryData = await EquipModel.retrieve_equip_rooms_by_equip_id([req.params.equipID], "elevatedEquip");
        } else 
        if (roomPermissions === 2 && equipPermissions === 1) {
            queryData = await EquipModel.retrieve_equip_rooms_by_equip_id([req.params.equipID], "elevatedRoom");
        } else 
        if (roomPermissions === 1 && equipPermissions === 1) {
            queryData = await EquipModel.retrieve_equip_rooms_by_equip_id([req.params.equipID], "public");
        };
        
        if (!queryData) {
            throw new ExpressError("Room not found.", 404);
        }
        
        return res.json({rooms: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 03/19/2022
equipRootRouter.get("/:equipID", 
    authMW.defineRoutePermissions({
        user: ["site_read_equip_self", "site_update_equip_self", "site_delete_equip_self"],
        group: ["group_read_equip", "group_update_equip", "group_delete_equip"],
        public: ["site_read_equip_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            if (!req.user?.id) {throw new ExpressError("User ID Not Defined", 401)};

            let queryData;
    
            let readPermitted = 0; // 1 = Public View, 2 = Private View
            let updatePermitted = 0; // 1 = Permitted
            let deletePermitted = 0; // 1 = Permitted

            req.resolvedPerms?.forEach((val: any) => {
                // Set Read Pemission Level
                if ( ((val.permissions_name === "site_read_equip_self") || (val.permissions_name === "group_read_equip"))) {
                    readPermitted = 2;
                };

                if ( val.permissions_name === "site_read_equip_public" && readPermitted !== 2) {
                    readPermitted = 1;
                };

                // Set Update Permission Level
                if ( ((val.permissions_name === "site_update_equip_self") || (val.permissions_name === "group_update_equip"))) {
                    updatePermitted = 1;
                };

                // Set Delete Permission Level
                if ( ((val.permissions_name === "site_delete_equip_self") || (val.permissions_name === "group_delete_equip"))) {
                    deletePermitted = 1;
                };
            })

            if (readPermitted === 2) {
                queryData = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID, "elevated");
            } else 
            if (readPermitted === 1) {
                queryData = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID, "public");
            };
            
            if (!queryData) {
                throw new ExpressError("Equip not found.", 404);
            }

            const output = {...queryData, canUpdate: updatePermitted, canDelete: deletePermitted};

            return res.json({equip: output});
        } catch (error) {
            next(error)
        }
    }
);


/* _   _ ____  ____    _  _____ _____ 
  | | | |  _ \|  _ \  / \|_   _| ____|
  | | | | |_) | | | |/ _ \ | | |  _|  
  | |_| |  __/| |_| / ___ \| | | |___ 
   \___/|_|   |____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 03/24/2022
equipRootRouter.patch("/:equipID",
    authMW.defineRoutePermissions({
        user: ["site_update_equip_self"],
        group: ["group_update_equip"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            const prevValues = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID, "elevated");
            if (!prevValues) {
                throw new ExpressError(`Update Failed: Equipment Not Found`, 404);
            };

            const updateValues: EquipUpdateProps = {
                name: req.body.name,
                category_id: req.body.category_id,
                headline: req.body.headline,
                description: req.body.description,
                image_url: req.body.image_url,
                public: req.body.public,
                configuration: req.body.configuration
            };

            if(!validateEquipUpdateSchema(updateValues)) {
                throw new ExpressError(`Update Error: ${validateEquipUpdateSchema.errors}`, 400);
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
            const newData = await EquipModel.modify_equip(req.params.equipID, itemsList);
            return res.json({equip: newData})
        } catch (error) {
            next(error)
        };
    }
);


/* ____  _____ _     _____ _____ _____ 
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|  
  | |_| | |___| |___| |___  | | | |___ 
  |____/|_____|_____|_____| |_| |_____|
*/
// Manual Test - Basic Functionality: 03/24/2022
equipRootRouter.delete("/:equipID", 
    authMW.defineRoutePermissions({
        user: ["site_delete_equip_self"],
        group: ["group_delete_equip"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        if (!req.user?.id) {throw new ExpressError(`Must be logged in to delete equipment`, 400);};

        let queryData;

        let groupDeletePermitted = 0;
        let siteDeletePermitted = 0;

        req.resolvedPerms?.forEach((val: any) => {
            // Set Delete Permission Level
            if (val.permissions_name === "site_delete_equip_self") {
                siteDeletePermitted = 1;
            };

            if (val.permissions_name === "group_delete_equip") {
                groupDeletePermitted = 1;
            };
        })

        if (siteDeletePermitted) {
            queryData = await EquipModel.delete_user_equip(req.user.id, req.params.equipID);
        } else if (groupDeletePermitted) {
            const groupData = await EquipModel.retrieve_equip_group_by_equip_id(req.params.equipID);
            if (groupData?.id) {
                queryData = await EquipModel.delete_group_equip(groupData.id, req.params.equipID);
            };
        };
        
        if(!queryData) {
            throw new ExpressError("Unable to delete target equipment", 404);
        }


        return res.json({message: "Equipment deleted."});
    } catch (error) {
        return next(error);
    }
});

export default equipRootRouter;