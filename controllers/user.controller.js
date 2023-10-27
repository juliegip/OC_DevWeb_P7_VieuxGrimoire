const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res, next) => {
    try {
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({error: 'Format email invalide'})
        }
        const hash = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS));
        const user = new User({
            email: req.body.email,
            password: hash
        })
        await user.save()
        res.status(201).json({message:'Utilisateur créé', userId:user._id})
    } catch (error) {
        res.status(500).json({error})
    }
}

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if (user === null) {
            return res.status(401).json({message: "Identifiant et/ou mot de passe incorrect"})
        }

        const valid = await bcrypt.compare(req.body.password, user.password)
        if (!valid) {
            return res.statut(401).json({message: "Identifiant et/ou mot de passe incorrect"})
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.TOKEN_KEY,
            { expiresIn: '24h' }
        )

        res.status(200).json({
            userId:user._id,
            token: token
        })
    } 
    catch(error) {
        res.status(500).json({error})
    }
}