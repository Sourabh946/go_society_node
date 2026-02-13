const router = require('express').Router()
const memberController = require('../controllers/member.controller')

// list members (admin)
router.get('/', memberController.list)

// assign member to flat
router.post('/', memberController.assign)

// update member (role / active period)
router.patch('/:id', memberController.update)

// soft delete member
router.delete('/:id', memberController.remove)

module.exports = router