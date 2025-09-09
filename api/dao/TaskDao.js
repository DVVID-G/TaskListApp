const Task = require("../models/Task");
const GlobalDAO = require("./GlobalDAO");

class TaskDAO extends GlobalDAO {

    constructor() {
        super(Task);
    }
}

module.exports = new TaskDAO();