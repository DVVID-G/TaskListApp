const Task = require("../models/Task");
const GlobalDAO = require("./GlobalDAO");

/**
 * Data Access Object (DAO) para la entidad Task.
 * Extiende las operaciones genéricas de GlobalDAO y expone el modelo Task para operaciones específicas.
 * @class
 * @extends GlobalDAO
 */



class TaskDAO extends GlobalDAO {
    /**
     * Inicializa el DAO de tareas con el modelo Task.
     */
    constructor() {
        super(Task);
                /**
         * Modelo Mongoose de la entidad Task.
         * @type {import('mongoose').Model}
         */
        this.model = Task;
    }
}

/**
 * Instancia única de TaskDAO para ser utilizada en los controladores.
 * @type {TaskDAO}
 */

module.exports = new TaskDAO();