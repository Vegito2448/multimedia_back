import { Request, Response } from 'express';
import { RequestWithUser } from "../middlewares/index.ts";
import { Category } from "../models/index.ts";


// Crear una nueva categoría
export const createCategory = async (req: RequestWithUser, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: 'name is mandatory' });
      return;
    }

    const category = new Category({ name });
    await category.save();
    res.status(201).json({
      ok: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ message: 'Error al crear la categoría', error });
  }
};

// Obtener todas las categorías
export const getCategory = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({
      deletedAt: null
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ message: 'Error al obtener las categorías', error });
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Categoría no encontrada' });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la categoría', error });
  }
};

// Actualizar una categoría
export const updateCategory = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { name },
      { new: true }
    );
    if (!category) {
      res.status(404).json({ message: 'Categoría no encontrada' });
      return;
    }
    res.status(200).json({
      ok: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la categoría', error });
  }
};

// Eliminar una categoría
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!category) {
      res.status(404).json({ message: 'Categoría no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría', error });
  }
};
