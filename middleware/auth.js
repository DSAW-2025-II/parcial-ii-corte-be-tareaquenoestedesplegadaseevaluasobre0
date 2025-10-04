//Módulo JWT para la verificación de tokens
const jwt = require('jsonwebtoken');

//Clave secreta definida desde .env
const JWT_SECRET = process.env.JWT_SECRET;

//Middleware para autenticar el token
const authenticateToken = (req, res, next) => {
    
    //Header para la autenticación
    const authHeader = req.headers['authorization'];

    //Dado que el token tiene Bearer, se extrae sin el Bearer
    const token = authHeader && authHeader.split(' ')[1];

    //Dado que no haya un token, se retorna un error 403
    if (!token) {
        return res.status(403).json({ 
        error: 'User not authenticated'
        });
    }

    //Verificación del token 
    jwt.verify(token, JWT_SECRET, (err, user) => {
        //Dado el caso que haya un error en la verificación
        if (err) {
        return res.status(403).json({ 
            error: 'Invalid token',
            message: 'Token expirado o inválido'
        });
        }

        //Cómo el token es válido, se agrega la información a la solicitud
        req.user = user;
        
        //Dado que es un middleware, se pasa al siguiente
        next();
    });
};

//Exportación del middleware
module.exports = authenticateToken;