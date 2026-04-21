const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Obtener estadísticas generales
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    const totalAuditsResult = await User.aggregate([
      { $project: { auditCount: { $size: "$auditHistory" } } },
      { $group: { _id: null, total: { $sum: "$auditCount" } } }
    ]);
    const totalAudits = totalAuditsResult[0]?.total || 0;
    
    const plansDistribution = await User.aggregate([
      { $group: { _id: "$subscription.plan", count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalUsers,
      totalAudits,
      plansDistribution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los usuarios
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las auditorías
router.get('/audits', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('name email subscription auditHistory');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar plan de un usuario
router.put('/user/:userId/plan', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { plan, creditsLimit } = req.body;
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    user.subscription.plan = plan;
    if (creditsLimit) user.subscription.creditsLimit = creditsLimit;
    await user.save();
    
    res.json({ success: true, message: 'Plan actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;