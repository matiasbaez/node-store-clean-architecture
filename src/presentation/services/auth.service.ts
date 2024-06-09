import { bcryptAdapter, JwtAdapter } from "../../adapters";
import { envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";

const WEBSERVICE_HOST = envs.WEBSERVICE_HOST;

export class AuthService {

    constructor(
        private emailService: EmailService
    ) {}

    private async sendEmailValidationLink(email: string) {

        const token = await JwtAdapter.generateToken({ email });
        if (!token) throw CustomError.internalServer("Error creating token");

        const link = `${WEBSERVICE_HOST}/auth/validate-email/${token}`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following to validate your email</p>
            <a href="${link}">Validate</a>
        `;

        const options = {
            to: email,
            subject: "Validate email",
            htmlBody: html
        };

        const isSent = await this.emailService.sendEmail(options);
        if (!isSent) throw CustomError.internalServer("Error sending email");

        return true;
    }

    public async login(loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.notFound("User not found");

        try {

            const validPassword = bcryptAdapter.compare(loginUserDto.password, user.password);
            if (!validPassword) {
                throw CustomError.badRequest("Invalid email/password");
            }

            const { password, ...rest } = UserEntity.fromObject(user);
            const token = await JwtAdapter.generateToken({
                id: user.id,
                name: user.name,
            });

            if (!token) {
                throw CustomError.internalServer("Error while encoding token");
            }

            return { token, user: rest };

        } catch(error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }

    public async register(registerUserDto: RegisterUserDto) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest("Email already exists");

        try {

            const user = new UserModel(registerUserDto);
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            const token = await JwtAdapter.generateToken({
                id: user.id,
                name: user.name,
            });

            if (!token) {
                throw CustomError.internalServer("Error while encoding token");
            }

            await this.sendEmailValidationLink(user.email);

            const { password, ...rest } = UserEntity.fromObject(user);

            return { token, user: rest };

        } catch(error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }

    public async validateEmail(token: string) {

        const payload: any = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.badRequest("Invalid token");

        const { email } = payload;
        if (!email) throw CustomError.internalServer("Invalid token");

        const user = await UserModel.findOne({ email });
        if (!user) throw CustomError.internalServer("Email not exists");

        user.emailValidated = true;
        await user.save();

        return true;

    }

}
