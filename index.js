const express = require('express');
const cors = require('cors');
const app = express();

const usuariosRouter = require('./routes/usuarios');
const productosRouter = require('./routes/productos');

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuariosRouter);
app.use('/productos', productosRouter);


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
