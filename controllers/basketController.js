const {Device, BasketDevice, Basket} = require('../models/models')

class BasketController {

    async addToBasket (req,res,next) {
        const {id} = req.user
        const {deviceId} = req.body
        const alreadyExist = await BasketDevice.findOne({
            where: {
                deviceId: deviceId,
                basketId: id,
            },
        })
        if (alreadyExist){
            return res.status(404).json({message: 'Товар уже добавлен в корзину'})
        }
        const basket = await BasketDevice.create({basketId:id, deviceId: deviceId})
        return res.json(basket)
    }

    async getBasketUser (req, res) {
        const {id} = req.user
        const basket = await BasketDevice.findAll({include:{
                model: Device
            }, where: {basketId: id}})

        return res.json(basket)
    }


}

module.exports = new BasketController()