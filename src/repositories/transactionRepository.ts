import ExpressError from "../utils/expresError";
import pgdb from "../databases/postgreSQL/pgdb";


class TransactionRepo {
    static async begin_transaction() {
        try {
            const result = await pgdb.query(`BEGIN`);
    
            return result;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to begin transaction - ${error}`, 500);
        };
    };
    
    
    static async commit_transaction() {
        try {
            const result = await pgdb.query(`COMMIT`);
    
            return result;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to commit transaction - ${error}`, 500);
        };
    };
    
    
    static async rollback_transaction() {
        try {
            const result = await pgdb.query(`ROLLBACK`);
    
            return result;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to rollback transaction - ${error}`, 500);
        };
    };  
};

export default TransactionRepo;