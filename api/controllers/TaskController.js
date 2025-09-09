const GlobalController = require("./GlobalController");
const TaskDAO = require("../dao/TaskDAO");



class TaskController extends GlobalController {

    constructor() {
        super(TaskDAO);
    }
    
    /**
     * Obtiene todas las tareas del usuario autenticado, ordenadas por fecha ascendente.
     * @param {Object} req - Objeto de solicitud Express (debe tener req.user.id).
     * @param {Object} res - Objeto de respuesta Express.
     */
    async getAll(req, res) {
        if (process.env.NODE_ENV === 'development') {
        console.log("req.user en getAll:", req.user);
        }
        try {
            const userId = req.user.id;
            const tasks = await TaskDAO.model.find({ user: userId }).sort({ createdAt: 1 });
            console.log("Tareas encontradas:", tasks);
            res.json(tasks);
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error(error);
            res.status(500).json({ message: "No pudimos obtener tus tareas, inténtalo más tarde" });
        }
    }

    async create(req, res) {
        try {
            const userId = req.user.id;
            const { title, description, status } = req.body;
            const task = await TaskDAO.model.create({ title, description, status, user: userId });
            res.status(201).json(task);
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error(error);
            res.status(500).json({ message: "No pudimos crear la tarea, inténtalo más tarde" });
        }
    }
}

module.exports = new TaskController();