
import jwt from "jsonwebtoken";
import { envs } from "../config";

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {

    constructor() {}

    static async generateToken(payload: any, duration: string = "2h") {
        const options = { expiresIn: duration };

        return new Promise((resolve) => {
            jwt.sign(
                payload,
                JWT_SEED,
                options,
                (error, token) => {
                    if (error) return resolve(null);
                    resolve(token);
                }
            );
        });
    }

    static async validateToken<T>(token: string): Promise<T|null> {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SEED, (error, decoded) => {
                if (error) resolve(null);
                resolve(decoded as T);
            });
        });
    }

}
