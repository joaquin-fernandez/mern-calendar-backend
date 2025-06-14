const jwt = require('jsonwebtoken');

const generateJWT = async (uid, name) => {
    const payload = {
        uid,
        name,
    };
    let tokenGenerado;
    await new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: '2h',
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('Error al generar el token');
                }
                resolve(token);
            }
        );
    }).then((token) => {
        tokenGenerado = token;
    });

    return tokenGenerado;
};

module.exports = { generateJWT };
