import multer from 'multer';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/wave'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 40 * 1024 * 1024 // Limit file size to 10MB
  },
  fileFilter: fileFilter,
});

export { upload };