// testMongo.js
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./api/models/User"); // importa tu modelo

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB:", mongoose.connection.name);

    // traer todos los usuarios
    const users = await User.find();
    console.log("Usuarios en la BD:", users);

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

test();
