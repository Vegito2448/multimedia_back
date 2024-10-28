import { NextFunction, Request, Response } from 'express';
import { Topic } from "../models/index.ts";

export const verifyUploadPermissions = async (req: Request, res: Response, next: NextFunction) => {
  const { topic } = req.body;

  try {
    const file = req.file as Express.Multer.File;

    if (!file) {
      res.status(400).json({
        ok: false,
        msg: 'No file uploaded'
      });
      return;
    }

    const topicDoc = await Topic.findById(topic);

    if (!topicDoc || topicDoc.deletedAt) {
      res.status(404).json({
        ok: false,
        msg: 'Topic not found or deleted'
      });
      return;
    }


    const fileType = file.mimetype.split('/')[0];

    if (fileType === 'image' && !topicDoc.permissions.images) {
      res.status(403).json({
        ok: false,
        msg: 'Images are not allowed for this topic'
      });
      return;
    }

    if (fileType === 'video' && !topicDoc.permissions.videos) {
      res.status(403).json({
        ok: false,
        msg: 'Videos are not allowed for this topic'
      });
      return;
    }

    if (fileType === 'text' && !topicDoc.permissions.texts) {
      res.status(403).json({
        ok: false,
        msg: 'Texts are not allowed for this topic'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Error verifying upload permissions:', error);
    res.status(500).json({
      ok: false,
      msg: 'Please talk to the administrator'
    });
  }
};