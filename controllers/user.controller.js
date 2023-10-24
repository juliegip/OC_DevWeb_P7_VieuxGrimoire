const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// exports.signup = (req, res, next) => {
//     bcrypt.hash(req.body.password, 10)
//         .then(hash => {
//             const user = new User({
//                 email: req.body.email,
//                 password: hash
//             });
//             user.save()
//                 .then(() => 
//                 res.status(201).json({ message: 'Utilisateur créé' }),
//                 res.send({userId: user._id}))
//                 .catch(error => res.status(400).json({ error }));
//         })
//         .catch(error => res.status(500).json({ error }));
// };


exports.signup = async (req, res, next) => {
    try {
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({error: 'Format email invalide'})
        }
        const hash = await bcrypt.hash(req.body.password, 10);
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
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'Identifiant et/ou mot de passe incorrect' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Identifiant et/ou mot de passe incorrect' });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '24h' }
                                )
                            });
                        }
                    })
                    .catch(error => { res.status(500).json({ error }); });
            }
        })
        .catch(error => { res.status(500).json({ error }); });
};
