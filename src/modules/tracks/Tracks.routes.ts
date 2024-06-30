import { Router, Request, Response } from "express";

import { upload } from '@shared/http/middlewares/upload';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';
import { singleton } from '@shared/tools/singleton';
import TracksController from './TracksController';
import { celebrate, Segments, Joi } from "celebrate";
const router = Router();
// Upload route
router.use(isAuthenticated);

router.post('/upload',
    upload.single('file'),
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().required(),
            artist: Joi.string().required(),
        }),
    }), (req, res) => singleton(TracksController).uploadFile(req, res));

router.get('/', (req, res) => singleton(TracksController).getAllFiles(req, res));

router.get('/:trackId',
    celebrate({
        [Segments.PARAMS]: {
            trackId: Joi.string().required(),
        }
    }), (req, res) => singleton(TracksController).getFileById(req, res));

export default router;