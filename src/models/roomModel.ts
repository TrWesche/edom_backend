// Repositories
import RoomRepo, { RoomObjectProps } from "../repositories/room.repository";

// Schemas
import { RoomCreateProps } from "../schemas/room/roomCreateSchema";

// Utility Functions
import ExpressError from "../utils/expresError";


class RoomModel {
    static async create(data: RoomCreateProps) {
        if (!data.name) {
            throw new ExpressError("Invalid Create Room Call", 400);
        }

        const room = RoomRepo.create_new_room(data);
        return room;
    };


    static async retrieve_room_by_room_id(roomID: string) {
        const room = RoomRepo.fetch_room_by_room_id(roomID);
        return room;
    };


    static async modify_room(roomID: string, data: RoomObjectProps) {
        if (!roomID) {
            throw new ExpressError("Error: Room ID not provided", 400);
        };

        // Perform Room Update
        const room = await RoomRepo.update_room_by_room_id(roomID, data);
        if (!room) {
            throw new ExpressError("Unable to update target room", 400);
        };

        return room;
    };


    static async delete_room(roomID: string) {
        if (!roomID) {
            throw new ExpressError("Error: Room ID not provided", 400);
        }

        const room = await RoomRepo.delete_room_by_room_id(roomID);
        if (!room) {
            throw new ExpressError("Unable to delete target room", 400);
        }

        return room;
    }
}

export default RoomModel;