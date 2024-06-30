import { Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import { Secret, sign } from "jsonwebtoken";
import AppError from '@shared/errors/AppError';
import { database } from 'src/database/database';
import { User } from '@shared/models/User';

export default class UsersController {
    protected get repository() {
        return database.getRepository(User)
    }

    public async login(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        let token: string = "";
        let user: any;

        try {
            user = await this.repository.findOne({
                where: {
                    email: email,
                }
            });
            if (!user) throw new AppError('user not found', 404);

            const isMatch = await compare(password, user.password);
            if (!isMatch) throw new AppError('password do not match', 401);

            token = sign({
                sub: {
                    id: user.id
                }
            }, process.env.APP_SECRET as Secret, { expiresIn: '30d' });

            delete user.password;
        } catch (err) {
            if (err instanceof AppError) return response.status(err.statusCode).json(err);
            return response.status(500).json(err);
        }

        return response.status(200).json({
            token: token,
            user: user
        });
    }

    public async show(request: Request, response: Response) {
        let user: any;
        try {
            user = await this.repository.findOne({
                where: {
                    id: request.user.id
                }
            });
            if (!user) throw new AppError("User not found", 404);
        } catch (err) {
            if (err instanceof AppError) return response.status(err.statusCode).json(err);
            return response.status(500).json(err);
        }
        return response.status(200).json(user);

    }

    public async create(request: Request, response: Response): Promise<Response> {
        let user: any;
        try {
            const { email, name, password } = request.body;
            const emailExists = await this.repository.findOne({
                where: {
                    email: email,
                }
            });

            if (emailExists) {
                throw new AppError("Email already exists");
            }

            const hashedPass = await hash(password, 8);

            user = this.repository.create({ name, email, password: hashedPass });

            await this.repository.save(user);

            delete user.password;
        } catch (err) {
            if (err instanceof AppError) return response.status(err.statusCode).json(err);
            return response.status(500).json(err);
        }

        return response.status(201).json(user);
    }
}