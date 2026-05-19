const validateCreateTask = (req, res, next) => {
  const { title, priority, project } = req.body;
  const errors = [];
  if (!title || title.trim() === '') {
    errors.push('Le titre est obligatoire');
  }
  const prioritesValides = ['basse', 'moyenne', 'haute'];
  if (!priority) {
    errors.push('La priorité est obligatoire');
  } else if (!prioritesValides.includes(priority)) {
    errors.push('La priorité doit être: basse, moyenne ou haute');
  }
  if (!project) {
    errors.push('Le projet est obligatoire');
  }
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
 
  next();
};
const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;
  const statutsValides = ['à faire', 'en cours', 'terminé'];
 
  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Le statut est obligatoire',
    });
  }
 
  if (!statutsValides.includes(statuts)) {
    return res.status(400).json({
      success: false,
      message: 'Le statut doit être: à faire, en cours ou terminé',
    });
  }
 
  next();
};
 
module.exports = { validateCreateTask, validateUpdateStatus };
 

