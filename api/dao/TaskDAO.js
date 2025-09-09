const Task = require("../models/Task");


const GlobalDAO = require("./GlobalDAO");

class TaskDAO extends GlobalDAO {
    constructor() {
        super(Task);
        this.model = Task;
    }
}

module.exports = new TaskDAO();