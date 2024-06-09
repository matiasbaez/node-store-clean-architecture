import { CustomError } from "../errors/custom.error";

export class ProductEntity {

    constructor(
        public id: string,
        public name: string,
        public description: string,
        public price: number,
        public user: string,
        public category: string,
        public available: boolean,
    ) {}

    static fromObject(obj: {[key: string]: any}) {
        const { _id, id, name, description, price, user, category, available } = obj;

        if (!_id || !id) {
            throw CustomError.badRequest("Missing id");
        }

        if (!name) {
            throw CustomError.badRequest("Missing name");
        }

        if (!description) {
            throw CustomError.badRequest("Missing description");
        }

        if (!price) {
            throw CustomError.badRequest("Missing price");
        }

        if (!user) {
            throw CustomError.badRequest("Missing user");
        }

        if (!category) {
            throw CustomError.badRequest("Missing category");
        }

        return new ProductEntity(_id || id, name, description, price, user, category, available);

    }

}