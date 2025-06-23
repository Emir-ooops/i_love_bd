const Router = require('express')
const router = new Router()

const itemRouter = require('./itemRouter')
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const brandRouter = require('./brandRouter')
const basketRouter = require('./basketRouter');


router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/item', itemRouter)
router.use('/basket', require('./basketRouter'));
module.exports = router
