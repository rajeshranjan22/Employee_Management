const Shift = require('../models/Shift');

const getAllShifts = async (req, res, next) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (err) {
    next(err);
  }
};

const createShift = async (req, res, next) => {
  try {
    const shift = await Shift.create(req.body);
    res.status(201).json(shift);
  } catch (err) {
    next(err);
  }
};

const updateShift = async (req, res, next) => {
  try {
    const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(shift);
  } catch (err) {
    next(err);
  }
};

const deleteShift = async (req, res, next) => {
  try {
    await Shift.findByIdAndDelete(req.params.id);
    res.json({ message: 'Shift deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllShifts,
  createShift,
  updateShift,
  deleteShift
};
