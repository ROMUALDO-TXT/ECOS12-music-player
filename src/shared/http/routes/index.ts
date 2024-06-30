import usersRouter from '@modules/users/Users.routes';
import tracksRouter from '@modules/tracks/Tracks.routes';
import streamRouter from '@modules/stream/Stream.routes';
import playlistsRouter from '@modules/playlists/Playlists.routes';

import { Router } from 'express';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/tracks', tracksRouter);
routes.use('/stream', streamRouter);
routes.use('/playlists', playlistsRouter);

routes.get('/', (request, response) => {
  return response.json({ message: 'hello world' });
});

export { routes };