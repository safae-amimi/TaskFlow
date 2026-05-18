const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
router.get('/', auth, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const projects = await Project.find({ 
    $or: [{ owner: req.user.id }, { members: req.user.id }]
}).skip(skip).limit(limit);
const total = await Project.countDocuments({
    $or: [{ owner: req.user.id }, { members: req.user.id }]
});
res.json({ data: projects, total, page, totalPages: Math.ceil(total / limit) });
});
router.post('/', auth, async (req, res) => {
    const { title, description, deadline } = req.body;
    const project = new Project({ title, description, deadline, owner: req.user.id });
    await project.save();
    res.status(201).json(project);
});
router.put('/:id', auth, async (req, res) => {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) return res.status(404).json({ message: 'Non trouvé ou non autorisé' });
    Object.assign(project, req.body);
    await project.save();

    await Activity.create({
        type: 'project_updated',
        project: project._id,
        user: req.user.id,
        details: `Projet "${project.title}" modifié`
    });

    res.json(project);
});
router.delete('/:id', auth, async (req, res) => {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) return res.status(404).json({ message: 'Non trouvé ou non autorisé' });
    await project.deleteOne();
    res.json({ message: 'Projet supprimé' });
});
module.exports = router;
