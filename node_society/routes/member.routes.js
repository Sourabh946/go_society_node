const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/member.controller');

// assign member to flat
router.post(
    '/',
    auth,
    role('admin', 'secretary'),
    controller.assign
);

// list all members
router.get(
    '/',
    auth,
    role('admin', 'secretary'),
    controller.getAll
);

// list members by flat
router.get(
    '/flat/:flat_id',
    auth,
    role('admin', 'secretary'),
    controller.getByFlat
);

// remove member
router.delete(
    '/:id',
    auth,
    role('admin'),
    controller.remove
);

module.exports = router;
