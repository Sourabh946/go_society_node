const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/role.controller');

router.use(auth, role('Admin'));

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;