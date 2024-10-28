import { Request, Response } from 'express';
import { Content, Topic } from "../models/index.ts";

export const searchContent = async (req: Request, res: Response) => {
  const { collection, term } = req.params;

  if (!term || !collection) {
    res.status(400).json({
      ok: false,
      message: 'Term and collection required'
    });
    return;
  }

  try {
    let results;

    switch (collection) {
      case 'topic':
        results = await Topic.find({
          name: { $regex: term, $options: 'i' },
          deletedAt: null
        });
        break;

      case 'content':
        results = await Content.find({
          title: { $regex: term, $options: 'i' },
          deletedAt: null
        })
          .populate('category', '-__v')
          .populate('topic', '-__v')
          .populate('createdBy', '-__v -password');


        break;

      default:
        res.status(400).json({
          ok: false,
          message: 'Invalid collection'
        });
        return;
    }

    res.status(200).json({
      ok: true,
      results
    });
  } catch (error) {
    console.error('Error searching content:', error);
    res.status(500).json({
      ok: false,
      message: 'Error searching content',
      error
    });
  }
};