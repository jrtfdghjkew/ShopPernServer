const Router = require('express')
const router = new Router()
const brandController = require('../controllers/brandController')
const checkRole = require('../middleware/CheckRoleMiddleware')


router.post('/',checkRole("ADMIN"),brandController.create)
router.get('/',brandController.getAll)
router.delete('/:id',checkRole("ADMIN"),brandController.delete)


module.exports = router