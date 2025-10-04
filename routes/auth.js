//Instalación de dependencias
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

//Variables de entorno
const VALID_EMAIL = process.env.VALID_EMAIL;
const VALID_PASSWORD = process.env.VALID_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

//Endpoint para autenticar usuarios
router.post('/auth', (req, res) => {
  
  //Extracción del correo y contraseña del cuerpo del request
  const { email, password } = req.body;

  //Se valida que existan los campos
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Se requieren el correo y la contraseña' 
    });
  }

  //Se valida que las credenciales sean correctas
  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    
    //Payload para agregar al token
    const payload = {
      email: email,
      timestamp: new Date().toISOString(),
      role: 'admin'
    };

    //Firmado del token con duración de 1 hora
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  
    //Respuesta del token
    return res.status(200).json({ 
      token: token
    });
  }

  //Dado el caso que las credenciales sean inválidas
  res.status(400).json({ 
    error: 'invalid credentials' 
  });
});

//Exportación del router
module.exports = router;