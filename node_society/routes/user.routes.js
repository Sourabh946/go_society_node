const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/user.controller');

router.use(auth);

// admin only
router.get('/', role('admin'), controller.getAll);
router.post('/', role('admin'), controller.create);
router.get('/:id', role('admin'), controller.getById);
router.put('/:id', role('admin'), controller.update);
router.delete('/:id', role('admin'), controller.remove);
router.put('/:id/password', role('admin'), controller.changePassword);
router.put('/:id/role', role('admin'), controller.changeRole);

// admin + secretary
router.put('/:id/flat', role('admin', 'secretary'), controller.assignFlat);

module.exports = router;