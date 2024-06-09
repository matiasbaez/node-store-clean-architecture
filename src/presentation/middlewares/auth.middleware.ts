import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../adapters";
import { UserEntity } from "../../domain";
import { UserModel } from "../../data";

export class AuthMiddleware {

    static async validateJWT(req: Request, res: Response, next: NextFunction) {

        const authorization = req.header("Authorization");

        if (!authorization) return res.status(401).json({ error: "No token provided" });
        if (!authorization.startsWith("Bearer")) return res.status(401).send({ error: "Invalid token" });

        const token = authorization.split(" ").at(1) || "";

        try {

            const payload = await JwtAdapter.validateToken<{ id: string }>(token);
            if (!payload) return res.status(401).json({ error: "Invalid token" });

            const user = await UserModel.findById(payload.id);
            if (!user) return res.status(401).json({ error: "Invalid user" });

            req.body.user = UserEntity.fromObject(user);

            next();

        } catch(error) {
            res.status(500).json({ error: "Internal server error" });
        }

    }

}
