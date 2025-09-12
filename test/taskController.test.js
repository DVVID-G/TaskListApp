const TaskController = require("../api/controllers/TaskController");
const TaskDAO = require("../api/dao/TaskDAO");

describe("TaskController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: "123" }, body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("debería devolver las tareas del usuario autenticado", async () => {
      const fakeTasks = [{ title: "Test task", user: "123" }];
      TaskDAO.model = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeTasks),
      };

      await TaskController.getAll(req, res);

      expect(TaskDAO.model.find).toHaveBeenCalledWith({ user: "123" });
      expect(res.json).toHaveBeenCalledWith(fakeTasks);
    });

    it("debería devolver 500 si ocurre un error", async () => {
      TaskDAO.model = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValue(new Error("DB error")),
      };

      await TaskController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "No pudimos obtener tus tareas, inténtalo más tarde",
      });
    });
  });

  describe("create", () => {
    it("debería crear una nueva tarea y devolver 201", async () => {
      req.body = {
        title: "Nueva tarea",
        description: "Desc",
        status: "pending",
      };
      const fakeTask = { ...req.body, user: "123" };
      TaskDAO.model = { create: jest.fn().mockResolvedValue(fakeTask) };

      await TaskController.create(req, res);

      expect(TaskDAO.model.create).toHaveBeenCalledWith({
        ...req.body,
        user: "123",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeTask);
    });

    it("debería devolver 500 si ocurre un error al crear", async () => {
      TaskDAO.model = {
        create: jest.fn().mockRejectedValue(new Error("DB error")),
      };

      await TaskController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "No pudimos crear la tarea, inténtalo más tarde",
      });
    });
  });
});
