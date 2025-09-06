const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
/**
 * User schema definition.
 * 
 * Represents application users stored in MongoDB.
 * Includes authentication fields and automatic timestamps.
 */
const userSchema = new mongoose.Schema({
  nombres: {
    type: String,
    required: [true, 'Los nombres son obligatorios'],
    trim: true,
    maxlength: [50, 'Los nombres no pueden exceder 50 caracteres']
  },
  apellidos: {
    type: String,
    required: [true, 'Los apellidos son obligatorios'],
    trim: true,
    maxlength: [50, 'Los apellidos no pueden exceder 50 caracteres']
  },
  edad: {
    type: Number,
    required: [true, 'La edad es obligatoria'],
    min: [13, 'La edad mínima es 13 años'],
    max: [120, 'Edad inválida']
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un correo electrónico válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    validate: {
        validator: function(value) {
            return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(value);
        },
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
  },
  confirmPassword: {
    type: String,
    required: [true, 'La confirmación de contraseña es obligatoria'],
    validate: {
      validator: function(value) {
        return value === this.password;
      },
      message: 'Las contraseñas no coinciden'
    }
},
}, },
{
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
/**
 * Mongoose model for the User collection.
 * Provides an interface to interact with user documents.
 */
module.exports = mongoose.model("User", userSchema);
