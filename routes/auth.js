const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

//Variables de entorno
const VALID_EMAIL = process.env.VALID_EMAIL;
const VALID_PASSWORD = process.env.VALID_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;


router.post('/auth', (req, res) => {
  
  const { email, password } = req.body;

  //Se validan los campos
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Se requieren el correo y la contraseña' 
    });
  }

  //Validación de credenciales
  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    
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

  //Invalid credentials
  res.status(400).json({ 
    error: 'invalid credentials' 
  });
});

module.exports = router;