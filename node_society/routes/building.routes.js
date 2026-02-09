const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/building.controller');

router.use(auth, role('admin', 'secretary'));

router.post('/', controller.create);
// router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);
router.get('/', controller.index)
module.exports = router;