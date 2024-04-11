const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {User, Basket} = require('../models/models')

const geterateJwt = (id, email, role) => {
     return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
    )
}

class UserController {
    async registration (req, res, next) {
        let {email, password, role} = req.body
        if(!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if(candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        if (role === null || role === undefined) {
            role = "USER"
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const basket = await Basket.create({userId: user.id})
        const token = geterateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async login (req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь с таким email не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = geterateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check (req, res, next) {
        const token = geterateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()