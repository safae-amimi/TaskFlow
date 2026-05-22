const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // 1. Récupérer le token depuis le header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Non autorisé — token manquant' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Récupérer l'utilisateur sans le mot de passe
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = { protect };