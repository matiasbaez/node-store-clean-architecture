import { Validators } from "../../../config";

export class CreateProductDto {

    private constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly user: string,
        public readonly category: string,
        public readonly available: boolean,
    ) {}

    static create(obj: { [key: string]: any }): [string?, CreateProductDto?] {
        const { name, description, price, user, category, available = false } = obj;
        let availableBoolean = available;

        if (!name) {
            return ["Missing name", undefined];
        }

        if (!description) {
            return ["Missing description", undefined];
        }

        if (!price) {
            return ["Missing price", undefined];
        }

        if (!user) {
            return ["Missing category", undefined];
        }

        if (!category) {
            return ["Missing category", undefined];
        }

        if (!Validators.isMongoId(user.id)) {
            return ["Invalid user id", undefined];
        }

        if (!Validators.isMongoId(category)) {
            return ["Invalid category id", undefined];
        }

        if (typeof available !== "boolean") {
            availableBoolean = (available === "true");
        }

        return [undefined, new CreateProductDto(name, description, price, user.id, category, availableBoolean)];
    }

}
