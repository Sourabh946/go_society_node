const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/user.controller');

router.use(auth);

// admin only
router.get('/', role('Admin'), controller.getAll);
router.post('/', role('Admin'), controller.create);
router.get('/:id', role('Admin'), controller.getById);
router.put('/:id', role('Admin'), controller.update);
router.delete('/:id', role('Admin'), controller.remove);
router.put('/:id/password', role('Admin'), controller.changePassword);
// router.put('/:id/role', role('Admin'), controller.changeRole);

// admin + secretary
router.put('/:id/flat', role('Admin', 'Secretary'), controller.assignFlat);

module.exports = router;