const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // modèle Project de tes coéquipiers
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Middleware : vérifier que l'utilisateur est le créateur du projet
const isOwner = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé — réservé au créateur' });
    }
    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// POST /api/projects/:id/members — Inviter un membre par email
router.post('/:id/members', protect, isOwner, async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier que l'utilisateur existe
    const userToInvite = await User.findOne({ email }).select('-password');
    if (!userToInvite) {
      return res.status(404).json({ message: 'Aucun compte trouvé avec cet email' });
    }

    // Vérifier qu'il n'est pas déjà membre
    const alreadyMember = req.project.members.includes(userToInvite._id);
    if (alreadyMember) {
      return res.status(400).json({ message: 'Cet utilisateur est déjà membre du projet' });
    }

    // Vérifier que ce n'est pas le créateur lui-même
    if (userToInvite._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Vous êtes déjà le créateur du projet' });
    }

    // Ajouter au tableau members
    req.project.members.push(userToInvite._id);
    await req.project.save();

    res.status(200).json({
      message: `${userToInvite.fullName} a été ajouté au projet`,
      member: {
        id: userToInvite._id,
        fullName: userToInvite.fullName,
        email: userToInvite.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// DELETE /api/projects/:id/members/:memberId — Retirer un membre
router.delete('/:id/members/:memberId', protect, isOwner, async (req, res) => {
  try {
    const { memberId } = req.params;

    // Vérifier que le membre existe dans le projet
    const memberIndex = req.project.members.indexOf(memberId);
    if (memberIndex === -1) {
      return res.status(404).json({ message: 'Ce membre ne fait pas partie du projet' });
    }

    // Retirer le membre
    req.project.members.pull(memberId);
    await req.project.save();

    res.status(200).json({ message: 'Membre retiré avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/projects/:id/members — Lister les membres (accessible à tous les membres)
router.get('/:id/members', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'fullName email')
      .populate('owner', 'fullName email');

    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }

    // Vérifier que l'utilisateur est membre ou créateur
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    const isProjectOwner = project.owner._id.toString() === req.user._id.toString();

    if (!isMember && !isProjectOwner) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.status(200).json({
      owner: project.owner,
      members: project.members,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;