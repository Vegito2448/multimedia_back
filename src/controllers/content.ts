import { Request, Response } from 'express';
import { deleteFromCloudinary, uploadToCloudinary } from "../helpers/index.ts";
import { io } from "../index.ts";
import { ITokenPayload, RequestWithUser } from "../middlewares/index.ts";
import { Content } from "../models/index.ts";
import { GenericRecord, IContent } from "../types/index.ts";

type GenericRequest = Request<GenericRecord, GenericRecord, IContent>;

// Crear una nueva contenido
export const createContent = async (req: GenericRequest, res: Response) => {
  try {
    const file = req.file as Express.Multer.File;

    if (!file) {
      res.status(400).json({
        ok: false,
        msg: 'No file uploaded'
      });
      return;
    }

    const result = await uploadToCloudinary(file);

    if (!result) {
      res.status(400).json({
        message: 'Error uploading file'
      });
      return;
    }

    const { title, description, createdBy, category, topic } = req.body;

    const newContent = {
      title,
      category,
      topic,
      description,
      createdBy,
      url: result.secure_url,
      filePublicId: result.public_id,
      createdAt: new Date()
    };

    const content = new Content(newContent);

    await content.save();

    io.emit('newContent', content);

    res.status(201).json({
      ok: true,
      message: 'Content created successfully',
      content
    });
  } catch (error) {
    console.error('Error creating content:', error);

    res.status(400).json({
      message: 'Error creating content',
      error
    });
  }
};

// Obtener todas las contenidos
export const getContent = async (_req: GenericRequest, res: Response): Promise<void> => {
  try {
    const content = await Content.find({
      deletedAt: null
    })
      .populate('category', '-__v')
      .populate('topic', '-__v')
      .populate('createdBy', '-__v -password');

    res.status(200).json(content);
  } catch (error) {
    console.error('Error getting content:', error);
    res.status(500).json({ message: 'Error getting Content', error });
  }
};

// Obtener una contenido por ID
export const getContentById = async (req: GenericRequest, res: Response): Promise<void> => {
  try {
    const content = await Content.findById(req.params.id).populate('category', '-__v')
      .populate('topic', '-__v')
      .populate('createdBy', '-__v -password');
    if (!content) {
      res.status(404).json({ message: 'Content not found' });
      return;
    }
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la contenido', error });
  }
};

export const updateContent = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const file = req?.file as Express.Multer.File | undefined;

    const { id: userLoggedID, role: roleLogged } = req.user as ITokenPayload;

    const { id } = req.params;

    const { title, description, category, topic } = req.body;

    const newContent: Partial<IContent> = {
      title,
      category,
      topic,
      description,
      updatedAt: new Date()
    };

    let content = await Content.findById(id);

    if (!content || content.deletedAt) {
      res.status(404).json({ message: 'Content not found' });
      return;
    }

    if (roleLogged !== 'admin' && content.createdBy.toString() !== userLoggedID) {
      res.status(401).json({
        ok: false,
        message: 'You cannot update this content'
      });
      return;
    }

    if (file) {
      if (content.filePublicId) {
        await deleteFromCloudinary(content.filePublicId);
      }

      const result = await uploadToCloudinary(file);

      if (!result) {
        res.status(400).json({
          message: 'Error uploading file'
        });
        return;
      }

      newContent.url = result.secure_url;
      newContent.filePublicId = result.public_id;
    }

    content = await Content.findByIdAndUpdate(
      id,
      newContent,
      { new: true }
    ).populate('category', '-__v')
      .populate('topic', '-__v')
      .populate('createdBy', '-__v -password');

    res.status(200).json({
      ok: true,
      message: 'Content updated successfully',
      content
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating content', error });
  }
};

export const deleteContent = async (req: GenericRequest, res: Response): Promise<void> => {
  try {
    const content = await Content.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!content) {
      res.status(404).json({
        ok: false,
        message: 'Content not found'
      });
      return;
    }
    res.status(200).json({
      ok: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting content: ', error });
  }
};
