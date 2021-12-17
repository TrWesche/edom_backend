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
    static async create(data: RobotCreateProps) {
        if (!data.name || !data.config) {
            throw new ExpressError("Invalid Create Robot Call", 400);
        };

        const robot = RobotRepo.create_new_robot(data);
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


    /*   _   _ ____  ____    _  _____ _____ 
        | | | |  _ \|  _ \  / \|_   _| ____|
        | | | | |_) | | | |/ _ \ | | |  _|  
        | |_| |  __/| |_| / ___ \| | | |___ 
         \___/|_|   |____/_/   \_\_| |_____|
    */
    static async modify_robot(robotID: string, data: RobotObjectProps) {
        if (!robotID) {
            throw new ExpressError("Error: Robot ID not provided", 400);
        }

        // Perform Robot Update
        const robot = await RobotRepo.update_robot_by_robot_id(robotID, data);
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
    static async delete_robot(robotID: string) {
        if (!robotID) {
            throw new ExpressError("Error: Robot ID not provided", 400);
        }

        const robot = await RobotRepo.delete_robot_by_robot_id(robotID);
        if (!robot) {
            throw new ExpressError("Unable to elete target robot", 400);
        }

        return robot;
    };
}

export default RobotModel;