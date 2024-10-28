import { Request, Response } from 'express';
import { Topic } from "../models/index.ts";
import { GenericRecord, ITopic } from "../types/index.ts";

type GenericRequest = Request<GenericRecord, GenericRecord, ITopic>;

// Crear una nueva temática
export const createTopic = async (req: GenericRequest, res: Response) => {
  try {
    const { name, permissions } = req.body;

    const topic = new Topic({ name, permissions });

    await topic.save();

    res.status(201).json({
      ok: true,
      message: 'Topic created successfully',
      topic
    });
  } catch (error) {
    console.error('Error creating topic:', error);

    res.status(400).json({ message: 'Error al crear la temática', error });
  }
};

// Obtener todas las temáticas
export const getTopic = async (_req: GenericRequest, res: Response): Promise<void> => {
  try {
    const topics = await Topic.find({
      deletedAt: null
    });
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error getting topics:', error);
    res.status(500).json({ message: 'Error al obtener las temáticas', error });
  }
};

// Obtener una temática por ID
export const getTopicById = async (req: GenericRequest, res: Response): Promise<void> => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      res.status(404).json({ message: 'temática no encontrada' });
      return;
    }
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la temática', error });
  }
};

// Actualizar una temática
export const updateTopic = async (req: GenericRequest, res: Response): Promise<void> => {
  try {
    const { name, permissions } = req.body;
    const topic = await Topic.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      {
        name,
        permissions
      },
      { new: true }
    );
    if (!topic) {
      res.status(404).json({ message: 'temática no encontrada' });
      return;
    }
    res.status(200).json({
      ok: true,
      message: 'Topic updated successfully',
      topic
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la temática', error });
  }
};

// Eliminar una temática
export const deleteTopic = async (req: GenericRequest, res: Response): Promise<void> => {
  try {
    const topic = await Topic.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!topic) {
      res.status(404).json({
        ok: false,
        message: 'temática no encontrada'
      });
      return;
    }
    res.status(200).json({
      ok: true,
      message: 'temática eliminada'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tematica', error });
  }
};
