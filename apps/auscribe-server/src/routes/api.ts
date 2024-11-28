import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import upload from '../middlewares/upload';
import config from '../config';
import logger from '../utils/logger';
import asyncHandler from 'express-async-handler';
import transcribe from '../utils/transcribe';

const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'API is up.',
  });
});

apiRouter.post(
  '/transcribe',
  upload.single('audio'),
  asyncHandler(async (req, res) => {
    // check if file exists
    const filename = req.file?.filename;
    if (!filename) {
      res.status(400).json({
        status: 400,
        message: 'Missing audio file or unsupported',
      });
      logger.error('Error: Missing audio file or unsupported.');
      return;
    }

    // process audio
    const filepath = path.join(config.paths.UPLOAD_FOLDER, filename);

    try {
      logger.info(`Creating transcription: ${filename}`);
      const transcription = await transcribe(filepath);
      logger.info(`Created transcription: ${filename}`);

      res.json({
        status: 200,
        message: transcription,
      });
    } catch (error) {
      await fs.unlink(filepath);
      res.status(500).json({
        status: 500,
        message:
          error instanceof Error
            ? error.message
            : 'An internal error occurred.',
      });
    }

    await fs.unlink(filepath);
  })
);

export default apiRouter;
