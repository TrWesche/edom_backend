import RobotRepo, { RobotObjectProps } from "../repositories/robot.repository";
import { RobotCreateProps } from "../schemas/robot/robotCreateSchema";
import ExpressError from "../utils/expresError";




class RobotModel {
    /*    ____ ____  _____    _  _____ _____ 
         / ___|  _ \| ____|  / \|_   _| ____|
        | |   | |_) |  _|   / _ \ | | |  _|  
        | |___|  _ <| |___ / ___ \| | | |___ 
         \____|_| \_\_____/_/   \_\_| |_____|
    */
    static async create_user_robot(userID: string, robotData: RobotCreateProps) {
        // if (!data.name || !data.config) {
        //     throw new ExpressError("Invalid Create Robot Call", 400);
        // };

        const robot = RobotRepo.create_new_robot(robotData);
        // TODO: Associate robot with user
        return robot;
    };

    static async create_group_robot(userID: string, groupID: string, robotData: RobotCreateProps) {
        // TODO: Check that user has permissions to target group

        const robot = RobotRepo.create_new_robot(robotData);
        // TODO Associate robot with group
        return robot;
    };



    /*   ____  _____    _    ____  
        |  _ \| ____|  / \  |  _ \ 
        | |_) |  _|   / _ \ | | | |
        |  _ <| |___ / ___ \| |_| |
        |_| \_\_____/_/   \_\____/ 
    */
    static async retrieve_robot_by_robot_id(robotID: string) {
        const robot = RobotRepo.fetch_robot_by_robot_id(robotID);
        return robot;
    };

    static async retrieve_robot_user_by_robot_id(robotID: string) {
        //TODO: Check if user profile is public
        //TODO: Return user data
    };

    static async retrieve_robot_group_by_robot_id(robotID: string) {
        //TODO: Check if group is public
        //TODO: Return group data
    };

    static async retrieve_robot_room_by_robot_id(robotID: string) {
        //TODO
    };


    /*   _   _ ____  ____    _  _____ _____ 
        | | | |  _ \|  _ \  / \|_   _| ____|
        | | | | |_) | | | |/ _ \ | | |  _|  
        | |_| |  __/| |_| / ___ \| | | |___ 
         \___/|_|   |____/_/   \_\_| |_____|
    */
    static async modify_robot(robotID: string, robotData: RobotObjectProps) {
        // if (!robotID) {
        //     throw new ExpressError("Error: Robot ID not provided", 400);
        // }

        // Perform Robot Update
        const robot = await RobotRepo.update_robot_by_robot_id(robotID, robotData);
        if (!robot) {
            throw new ExpressError("Unable to update target robot", 400);
        }

        return robot;
    };


    /*   ____  _____ _     _____ _____ _____ 
        |  _ \| ____| |   | ____|_   _| ____|
        | | | |  _| | |   |  _|   | | |  _|  
        | |_| | |___| |___| |___  | | | |___ 
        |____/|_____|_____|_____| |_| |_____|
    */
    static async delete_user_robot(userID: string, robotID: string) {
        // if (!robotID) {
        //     throw new ExpressError("Error: Robot ID not provided", 400);
        // }

        // TODO: Check user permissions


        const robot = await RobotRepo.delete_robot_by_robot_id(robotID);
        if (!robot) {
            throw new ExpressError("Unable to delete target robot", 400);
        }

        return robot;
    };
    
    static async delete_group_robot(userID: string, groupID: string, robotID: string) {
        // if (!robotID) {
        //     throw new ExpressError("Error: Robot ID not provided", 400);
        // }

        // TODO: Check user permissions


        const robot = await RobotRepo.delete_robot_by_robot_id(robotID);
        if (!robot) {
            throw new ExpressError("Unable to delete target robot", 400);
        }

        return robot;
    };


    static async remove_robot_from_room(robotID: string, roomID: string) {
        //TODO
    };
}

export default RobotModel;