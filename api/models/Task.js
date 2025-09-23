const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [50, 'El título no puede exceder 50 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
    status: {
    type: String,
    enum: ['Por hacer', 'Haciendo', 'Hecho'],
    default: 'Por hacer'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  expectedDate: {
    type: Date,
    required: [true, 'La fecha esperada es obligatoria']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Task", taskSchema);