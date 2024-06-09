import { CustomError } from "../errors/custom.error";

export class CategoryEntity {

    constructor(
        public id: string,
        public name: string,
        public user: string,
        public available: boolean,
    ) {}

    static fromObject(obj: {[key: string]: any}) {
        const { _id, id, name, user, available } = obj;

        if (!_id || !id) {
            throw CustomError.badRequest("Missing id");
        }

        if (!name) {
            throw CustomError.badRequest("Missing name");
        }

        if (!user) {
            throw CustomError.badRequest("Missing user");
        }

        return new CategoryEntity(_id || id, name, user, available);

    }

}