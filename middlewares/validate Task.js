const validateCreateTask = (req, res, next) => {
  const { titre, priorite, projet } = req.body;
  const errors = [];
  if (!titre || titre.trim() === '') {
    errors.push('Le titre est obligatoire');
  }
  const prioritesValides = ['basse', 'moyenne', 'haute'];
  if (!priorite) {
    errors.push('La priorité est obligatoire');
  } else if (!prioritesValides.includes(priorite)) {
    errors.push('La priorité doit être: basse, moyenne ou haute');
  }
  if (!projet) {
    errors.push('Le projet est obligatoire');
  }
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
 
  next();
};
const validateUpdateStatus = (req, res, next) => {
  const { statut } = req.body;
  const statutsValides = ['à faire', 'en cours', 'terminé'];
 
  if (!statut) {
    return res.status(400).json({
      success: false,
      message: 'Le statut est obligatoire',
    });
  }
 
  if (!statutsValides.includes(statut)) {
    return res.status(400).json({
      success: false,
      message: 'Le statut doit être: à faire, en cours ou terminé',
    });
  }
 
  next();
};
 
module.exports = { validateCreateTask, validateUpdateStatus };
 