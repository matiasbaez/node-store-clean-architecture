import { regularExps } from "../../../config";

export class LoginUserDto {

    private constructor(
        public readonly email: string,
        public readonly password: string,
    ) {}

    static create(obj: { [key: string]: any }): [string?, LoginUserDto?] {
        const { email, password } = obj;

        if (!email) {
            return ["Missing email", undefined];
        }

        if (!regularExps.email.test(email)) {
            return ["Email is not valid", undefined];
        }

        if (!password) {
            return ["Missing password", undefined];
        }

        if (password.length < 6) {
            return ["Password is too short", undefined];
        }

        return [undefined, new LoginUserDto(email, password)];
    }

}
