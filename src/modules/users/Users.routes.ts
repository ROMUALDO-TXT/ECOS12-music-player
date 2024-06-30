import { celebrate, Joi, Segments } from "celebrate";
import { Router, Request, Response } from "express";
import UsersController from "./UsersController";
import { singleton } from "@shared/tools/singleton";

const usersRouter = Router();

usersRouter.post(
    '/register',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }
    }),
    (req: Request, res: Response) => { singleton(UsersController).create(req, res) }

);

usersRouter.post(
    '/login',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }
    }),
    (req: Request, res: Response) => { return singleton(UsersController).login(req, res) }
)

usersRouter.get(
    '/show',
    (req: Request, res: Response) => { singleton(UsersController).show(req, res) }
)

export default usersRouter;