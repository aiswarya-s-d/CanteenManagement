const db = require("../config/db");
const addFood = (req, res) => {
    const {
        name,
        price,
        quantity,
        refill_threshold,
        category,
        food_image
    } = req.body;

    const status = quantity > 0 ? "available" : "unavailable";

    const sql = `
    INSERT INTO food_items
    (name, price, quantity, refill_threshold, status, category,food_image)
    VALUES (?, ?, ?, ?, ?, ?,?)
    `;

    db.query(
        sql,
        [name, price, quantity, refill_threshold, status, category,food_image],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json({
                message: "Food added successfully"
            });
        }
    );
};
const getFoods = (req, res) => {
    const sql = "SELECT * FROM food_items";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
};
const updateFoods = (req, res) => {
    const { id } = req.params;

    const {
        name,
        category,
        price,
        quantity,
        refill_threshold,
        refill_quantity,
        status
    } = req.body;

    const sql = `
        UPDATE food_items
        SET
            name = ?,
            category = ?,
            price = ?,
            quantity = ?,
            refill_threshold = ?,
            refill_quantity = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            category,
            price,
            quantity,
            refill_threshold,
            refill_quantity,
            status,
            id
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Food item updated successfully"
            });
        }
    );
};
const deleteFoods= (req, res) => {
    const { id } = req.params;
    const sql =
        "DELETE FROM food_items WHERE id = ?";
    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Food item deleted successfully"
            });
        }
    );
};
module.exports = { addFood, getFoods,updateFoods,deleteFoods };