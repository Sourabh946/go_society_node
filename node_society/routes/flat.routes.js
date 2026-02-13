const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/flat.controller');

router.use(auth, role('Admin', 'Secretary'));

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

router.get('/building/:building_id', controller.getFlatsByBuilding);

module.exports = router;