const {Type} = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
    async create (req, res) {
        const {name} = req.body
        const type = await Type.create({name})
        return res.json({type})
    }

    async getAll (req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }

    async delete (req, res) {
        const {id} = req.params
        const type = await Type.findOne({where:{id}})
        await type.destroy();
        return res.json({message:"type was deleted"})

    }
}

module.exports = new TypeController()