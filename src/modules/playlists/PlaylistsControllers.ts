import { Request, Response } from 'express';
import AppError from '@shared/errors/AppError';
import { database } from 'src/database/database';
import { Playlist } from '@shared/models/Playlist';
import { Track } from '@shared/models/Track';
import { In } from 'typeorm';

export class PlaylistController {
    protected get repository() {
        return database.getRepository(Playlist)
    }

    public async createPlaylist(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;
            const ownerId = req.user.id;

            console.log(ownerId);

            const playlist = this.repository.create({
                name,
                description,
                owner: {
                    id: ownerId,
                }
            })

            await this.repository.save(playlist);

            res.status(201).json(playlist);
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
    public async getPlaylistById(req: Request, res: Response) {
        try {
            const playlistId = req.params.playlistId;
            const playlist = await this.repository.findOne({
                select: {
                    id: true,
                    tracks: true,
                    name: true,
                    description: true,
                    owner: {
                        name: true,
                    }
                },
                where: {
                    id: playlistId
                },
                relations: {
                    tracks: true,
                    owner: true,
                }
            })

            if (!playlist) {
                throw new AppError('Playlist not found', 404);
            }

            res.json(playlist);
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }

    public async getPlaylists(req: Request, res: Response) {
        try {
            const ownerId = req.user.id;
            const playlist = await this.repository.find({
                select: {
                    id: true,
                    tracks: true,
                    name: true,
                    description: true,
                    owner: {
                        name: true,
                    }
                },
                where: {
                    owner: {
                        id: ownerId
                    }
                },
                relations: {
                    tracks: true,
                    owner: true,
                }
            })

            if (!playlist) {
                throw new AppError('Playlist not found', 404);
            }

            res.json(playlist);
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }

    public async addTrackToPlaylist(req: Request, res: Response) {
        try {
            const { playlistId, trackId } = req.body;

            const playlist = await this.repository.findOne({ where: { id: playlistId }, relations: ['tracks'] });

            if (!playlist) {
                throw new AppError('Playlist not found', 404);
            }

            const track = await database.getRepository(Track).findOne({
                where: {
                    id: trackId
                }
            });

            if (!track) throw new AppError('Track not found', 404);

            if (playlist.tracks.find((t) => t.id === track.id)) throw new AppError('Track already in playlist', 401);

            playlist.tracks.push(track);

            await this.repository.save(playlist);

            res.status(200).json(playlist);
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }

    public async removeTrackFromPlaylist(req: Request, res: Response) {
        try {
            const { playlistId, trackId } = req.body;

            const playlist = await this.repository.findOne({
                where: { id: playlistId },
                relations: ['tracks'],
            });

            if (!playlist) {
                throw new AppError('Playlist not found', 404);
            }

            const trackToRemove = playlist.tracks.find((t) => t.id === trackId);

            if (!trackToRemove) {
                throw new AppError('Track not found in playlist', 404);
            }

            playlist.tracks = playlist.tracks.filter((t) => t.id !== trackId);

            await this.repository.save(playlist);

            res.status(200).json(playlist);
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
}