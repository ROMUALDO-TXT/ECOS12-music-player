// StreamController.ts
import AppError from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { database } from 'src/database/database';
import { Track } from '@shared/models/Track';
import fs from 'fs';

export default class StreamController {

    public async streamFile(req: Request, res: Response): Promise<void> {
        try {
            const fileId = req.params.fileId;
            const file = await database.getRepository(Track).findOne({
                where: {
                    id: fileId,
                }
            });

            if (!file) {
                throw new AppError('File not found', 404);
            }

            const filePath = file.filePath;
            const stat = fs.statSync(filePath);
            const fileSize = stat.size;
            const range = req.headers.range;

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

                const chunksize = (end - start) + 1;
                const file = fs.createReadStream(filePath, { start, end });
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'audio/mpeg',
                };

                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'audio/mpeg',
                };
                res.writeHead(200, head);
                fs.createReadStream(filePath).pipe(res);
            }
        } catch (err) {
            if (err instanceof AppError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                console.log(err)
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
}