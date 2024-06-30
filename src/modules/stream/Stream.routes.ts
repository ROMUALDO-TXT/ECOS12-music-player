import { singleton } from '@shared/tools/singleton';
import { Router } from 'express';
import StreamController from './StreamController';
import { celebrate, Segments, Joi } from 'celebrate';

const router = Router();

router.get('/:fileId', 
    celebrate({
        [Segments.PARAMS]: {
            fileId: Joi.string().required(),
        }
    }),
    (req, res) => singleton(StreamController).streamFile(req, res));

export default router;