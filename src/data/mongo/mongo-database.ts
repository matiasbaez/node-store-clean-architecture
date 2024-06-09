import mongoose from "mongoose";


interface Options {
    dbUrl: string;
    dbName: string;
}

export class MongoDataBase {

    static async connect(options: Options) {
        const { dbUrl, dbName } = options;

        try {

            await mongoose.connect(dbUrl, {
                dbName
            });

            console.log("Connection to DB stablished");

            return true;

        } catch(err) {
            console.log("Mongo connection error");
            throw err;
        }

    }

    static async disconnect() {
        await mongoose.disconnect();
    }

}
