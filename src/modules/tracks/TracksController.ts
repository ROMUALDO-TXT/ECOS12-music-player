import { Request, Response } from 'express';
import AppError from '@shared/errors/AppError';
import { Track } from '@shared/models/Track';
import { database } from 'src/database/database';

export default class TracksController {
    protected get repository() {
        return database.getRepository(Track)
    }

    public async uploadFile(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file;

            if (!file) throw new AppError('File not provided', 401);

            const { originalname, mimetype, path} = file;
            const { name, artist } = req.body;

            const newFile = this.repository.create({
                name,
                artist,
                mimetype,
                filename: originalname,
                filePath: path
            });

            const track = await this.repository.save(newFile);

            res.status(201).json(track);
        } catch (err) {
            console.log(err)

            if (err instanceof AppError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }

    public async getFileById(req: Request, res: Response): Promise<void> {
        try {
            const fileId = req.params.fileId;
            const file = await this.repository.findOne({
                where: {
                    id: fileId
                }
            });
            if (!file) {
                throw new AppError('File not found', 404);
            }

            res.json(file);

        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }

    // public async deleteFile(req: Request, res: Response): Promise<void> {
    //     try {
    //         const fileId = req.params.fileId;
    //         await this.uploadsService.deleteFile(fileId);
    //         res.status(204).send();
    //     } catch (err) {
    //         if (err instanceof AppError) {
    //             res.status(err.statusCode).json({ message: err.message });
    //         } else {
    //             res.status(500).json({ message: 'Internal Server Error' });
    //         }
    //     }
    // }

    public async getAllFiles(req: Request, res: Response): Promise<void> {
        try {
            const tracks = await this.repository.find();
            res.json(tracks);
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
}
