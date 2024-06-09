import { envs } from "../../config";
import { CategoryModel, UserModel, ProductModel } from "../mongo";
import { MongoDataBase } from "../mongo/mongo-database";
import { seedData } from "./data";

(async() => {

    MongoDataBase.connect({
        dbName: envs.MONGO_DB_NAME,
        dbUrl: envs.MONGO_URL
    });

    await main();

    await MongoDataBase.disconnect();

})();

const randomBetween0AndX = (x: number) => {
    return Math.floor(Math.random() * x);
}

async function main() {

    await Promise.all([
        UserModel.deleteMany({}),
        ProductModel.deleteMany({}),
        CategoryModel.deleteMany({}),
    ]);

    const users = await UserModel.insertMany(seedData.users);

    const categories = await CategoryModel.insertMany(
        seedData.categories.map((category) => ({
            ...category,
            user: users[randomBetween0AndX(users.length - 1)]._id
        }))
    );

    const products = await ProductModel.insertMany(
        seedData.products.map((product) => ({
            ...product,
            user: users[randomBetween0AndX(users.length - 1)]._id,
            category: categories[randomBetween0AndX(categories.length - 1)]._id,
        }))
    );

}