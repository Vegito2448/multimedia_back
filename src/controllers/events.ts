import { Request, Response } from "express";
import { Event } from "../models/index.ts";
import { GenericRecord, IEvent } from "../types/index.ts";

interface IEventRequest extends Request<GenericRecord, GenericRecord, IEvent> { }

const getEvents = async (_req: Request, res: Response) => {

  try {

    const events = await Event.find().populate('createdBy', 'name').populate('updatedBy', 'name').populate('deletedBy', 'name');

    res.json({
      ok: true,
      msg: 'success',
      events

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator'
    });

  }
};

const createEvent = async (req: IEventRequest, res: Response) => {
  const { title, start, end, notes, createdBy } = req.body;

  const event = new Event({ title, start, end, notes, createdBy });

  try {

    await event.save();

    res.json({
      ok: true,
      msg: 'Event created',
      event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator'
    });

  }
};

const updateEvent = async (req: IEventRequest, res: Response) => {

  const { id } = req.params;

  const { title, start, end, notes, updatedBy } = req.body;

  try {

    const event = await Event.findById(id);

    if (!event || event.deletedBy) {
      res.status(404).json({
        ok: false,
        msg: 'Event not found'
      });
      return;
    }

    if (updatedBy !== event.createdBy.toString()) {
      res.status(401).json({
        ok: false,
        msg: 'You do not have the necessary permissions'
      });
      return;
    }

    const newEvent = {
      title,
      start,
      end,
      notes,
      updatedBy
    };

    const updatedEvent = await Event.findByIdAndUpdate(id, newEvent, { new: true }).populate('createdBy', 'name').populate('updatedBy', 'name').populate('deletedBy', 'name');

    res.json({
      ok: true,
      msg: 'Event updated',
      event: updatedEvent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator'
    });

  }
};

const deleteEvent = async (req: Request, res: Response) => {

  const { id } = req.params;
  const { deletedBy } = req.body;
  try {

    const event = await Event.findById(id);

    if (!event || event.deletedBy) {
      res.status(404).json({
        ok: false,
        msg: 'Event not found or already deleted'
      });
      return;
    }

    const deletedEvent = await Event.findByIdAndUpdate(id, { deletedBy }, { new: true }).populate('createdBy', 'name').populate('updatedBy', 'name').populate('deletedBy', 'name');


    res.json({
      ok: true,
      msg: 'Event deleted',
      event: deletedEvent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator'
    });

  }
};

export {
  createEvent, deleteEvent, getEvents, updateEvent
};

