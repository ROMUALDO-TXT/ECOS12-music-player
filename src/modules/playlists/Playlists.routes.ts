import { Router, Request, Response } from "express";
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';
import { PlaylistController } from './PlaylistsControllers';
import { singleton } from '@shared/tools/singleton';
import { celebrate, Segments, Joi } from "celebrate";

const router = Router();

router.use(isAuthenticated);

router.post('/', 
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            description: Joi.string().required(),
        }
    }), (req, res) => singleton(PlaylistController).createPlaylist(req, res));

router.get('/:playlistId',
    celebrate({
        [Segments.PARAMS]: {
            playlistId: Joi.string().required(),
        }
    }), (req, res) => singleton(PlaylistController).getPlaylistById(req, res));

    router.get('/', (req, res) => singleton(PlaylistController).getPlaylists(req, res));

router.post('/add',
    celebrate({
        [Segments.BODY]: {
            trackId: Joi.string().required(),
            playlistId: Joi.string().required(),
        },
    }), (req, res) => singleton(PlaylistController).addTrackToPlaylist(req, res));

router.post('/remove',
    celebrate({
        [Segments.BODY]: {
            trackId: Joi.string().required(),
            playlistId: Joi.string().required(),
        },
    }), (req, res) => singleton(PlaylistController).removeTrackFromPlaylist(req, res));


export default router;