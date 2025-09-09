const GlobalController = require("./GlobalController");
const TaskDAO = require("../dao/TaskDAO");



class TaskController extends GlobalController {

    constructor() {
        super(TaskDAO);
    }
}

module.exports = new TaskController();