/**
 * Generic global controller class providing common CRUD operations.
 * It delegates the actual database logic to a corresponding DAO (Data Access Object).
 */
class GlobalController {
    /**
     * Create a new GlobalController.
     * @param {object} dao - The DAO instance used to interact with the database.
     */
    constructor(dao) {
        this.dao = dao;
    }
    /**
     * Create a new document in the database.
     * @async
     * @param {import('express').Request} req - Express request object containing the data in `req.body`.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>} Sends status 201 with the created document, or 400 on error.
     */
    async create(req, res) {
        console.log("Creating item with data:", req.body);
        try {
            const item = await this.dao.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    /**
     * Retrieve a document by ID.
     * @async
     * @param {import('express').Request} req - Express request object with `req.params.id`.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>} Sends status 200 with the document, or 404 if not found.
     */
    async read(req, res) {
        try {
            const item = await this.dao.read(req.params.id);
            res.status(200).json(item);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    /**
     * Update an existing document by ID.
     * @async
     * @param {import('express').Request} req - Express request object with `req.params.id` and update data in `req.body`.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>} Sends status 200 with the updated document, or 400 on validation error.
     */
    async update(req, res) {
        try {
            const item = await this.dao.update(req.params.id, req.body);
            res.status(200).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    /**
     * Delete a document by ID.
     * @async
     * @param {import('express').Request} req - Express request object with `req.params.id`.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>} Sends status 200 with the deleted document, or 404 if not found.
     */
    async delete(req, res) {
        try {
            const item = await this.dao.delete(req.params.id);
            res.status(200).json(item);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    /**
         * Retrieve all documents, optionally filtered by query parameters.
         * @async
         * @param {import('express').Request} req - Express request object (filters in `req.query`).
         * @param {import('express').Response} res - Express response object.
         * @returns {Promise<void>} Sends status 200 with the array of documents, or 400 on error.
         */
    async getAll(req, res) {
        try {
            const items = await this.dao.getAll(req.query);
            res.status(200).json(items);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = GlobalController;
