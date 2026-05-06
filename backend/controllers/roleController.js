const Role = require('../models/Role');

const getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    res.json(roles);
  } catch (err) {
    next(err);
  }
};

const createRole = async (req, res, next) => {
  try {
    const { name, permissions, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Role name is required' });
    }

    const newRole = await Role.create({
      name,
      permissions: permissions || [],
      description,
      isCustom: true
    });

    res.status(201).json(newRole);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'A role with this name already exists' });
    }
    next(err);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const { name, permissions, description } = req.body;
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    if (!role.isCustom) {
      return res.status(400).json({ error: 'Cannot modify standard system roles' });
    }

    role.name = name || role.name;
    role.permissions = permissions || role.permissions;
    role.description = description || role.description;

    const updatedRole = await role.save();
    res.json(updatedRole);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'A role with this name already exists' });
    }
    next(err);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    if (!role.isCustom) {
      return res.status(400).json({ error: 'Cannot delete standard system roles' });
    }

    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole
};
