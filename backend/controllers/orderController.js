const db = require("../config/db");
function formatTime(time) {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}
const placeOrder = async (req, res) => {
    try {
        const {
            user_id,
            pickup_time,
            payment_method,
            items
        } = req.body;
        const mealTimings = {
                    breakfast: {
                        start: "07:30",
                        end: "11:00"
                    },
                    lunch: {
                        start: "11:00",
                        end: "14:30"
                    },
                    snacks: {
                        start: "10:30",
                        end: "17:00"
                    },
                    drinks:{
                        start: "10:30",
                        end: "17:00"
                    }
        };
        let orderCategory = null;
        let totalAmount = 0;
        const foodDetails = [];
        for (const item of items) {
            const [rows] = await db.promise().query(
                `SELECT *
                 FROM food_items
                 WHERE id = ?`,
                [item.food_id]
            );
            if (rows.length === 0) {
                return res.status(404).json({
                    message: `Food item ${item.food_id} not found`
                });
            }
            const food = rows[0];
            if (orderCategory === null) {
            orderCategory = food.category;
            }
            const validCombo =
            orderCategory === food.category ||
            (
                (orderCategory === "snacks" && food.category === "drinks") ||
                (orderCategory === "drinks" && food.category === "snacks")
          );
            if (!validCombo) {
            return res.status(400).json({
            message: "Only same-category items and Snacks + Drinks combos are allowed"
            });
        }
            const now = new Date();
            const currentTime =
            now.getHours().toString().padStart(2, "0") +
            ":" +
            now.getMinutes().toString().padStart(2, "0");
            const pickupDate = new Date(pickup_time);
            const pickupTime =
            pickupDate.getHours().toString().padStart(2, "0") +
            ":" +
            pickupDate.getMinutes().toString().padStart(2, "0");
            const timing = mealTimings[food.category];
            if (
            currentTime < timing.start ||
            currentTime > timing.end
            ) {
                return res.status(400).json({
                message: `${food.category} items are not available at this time`
  });
  }
            if (
            pickupTime < timing.start ||
            pickupTime > timing.end
          ) {
            return res.status(400).json({
            message: `Pickup time must be between ${formatTime(timing.start)} and ${formatTime(timing.end)} for ${food.category}`
           });
        }
            if (item.quantity > food.quantity && food.quantity > 0) {
                return res.status(400).json({
                    message: `${food.name} has only ${food.quantity} items available`
                });
            }
            if(food.quantity === 0){
                return res.status(400).json({
                    message: `${food.name} is currently unavailable`
                });
            }
            food.quantity-=item.quantity;
            const subtotal = food.price * item.quantity;
            totalAmount += subtotal;
            foodDetails.push({
                ...food,
                orderedQuantity: item.quantity,
                subtotal
            });
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const [orderResult] = await db.promise().query(
            `
            INSERT INTO orders
            (user_id, pickup_time,otp, payment_method, total_amount)
            VALUES (?, ?, ?,?, ?)
            `,
            [user_id, pickup_time, otp, payment_method, totalAmount]
        );
        const orderId = orderResult.insertId;
        for (const food of foodDetails) {
            await db.promise().query(
                `
                INSERT INTO order_items
                (order_id, food_id, quantity, subtotal)
                VALUES (?, ?, ?, ?)
                `,
                [
                    orderId,
                    food.id,
                    food.orderedQuantity,
                    food.subtotal
                ]
            );
            let newQuantity = food.quantity;
            let refillDone = food.refill_done;
            let status = food.status;
            if (
                newQuantity <= food.refill_threshold &&
                refillDone === 0
            ) {
                newQuantity += food.refill_quantity;
                refillDone = 1;
            }
            if (newQuantity === 0) {
                status = "Unavailable";
            }
            await db.promise().query(
                `
                UPDATE food_items
                SET
                    quantity = ?,
                    refill_done = ?,
                    status = ?
                WHERE id = ?
                `,
                [
                    newQuantity,
                    refillDone,
                    status,
                    food.id
                ]
            );
        }
        res.status(201).json({
            message: "Order placed successfully",
            order_id: orderId,
            otp: otp,
            total_amount: totalAmount
        });

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.promise().query(`
      SELECT
        o.id,
        o.pickup_time,
        o.otp,
        o.status,
        o.payment_status,
        o.total_amount,
        u.name AS customer,
        GROUP_CONCAT(
          CONCAT(f.name, ' x', oi.quantity)
          SEPARATOR ', '
        ) AS items,
        GROUP_CONCAT(
          f.food_image
          SEPARATOR ','
        ) AS food_images
      FROM orders o
      JOIN users u
        ON o.user_id = u.id
      JOIN order_items oi
        ON o.id = oi.order_id
      JOIN food_items f
        ON oi.food_id = f.id
      GROUP BY o.id
      ORDER BY o.id DESC
    `);
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getTopSellingItems = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT
    f.name,
    f.food_image,
    SUM(oi.quantity) AS totalSold
    FROM order_items oi
    JOIN food_items f
    ON oi.food_id = f.id
    GROUP BY oi.food_id
    ORDER BY totalSold DESC
    LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = [
            "pending",
            "accepted",
            "preparing",
            "ready",
            "delivered",
            "cancelled"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const [result] = await db.promise().query(
            `
            UPDATE orders
            SET status = ?
            WHERE id = ?
            `,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated successfully"
        });

    } catch (err) {
        res.status(500).json(err);
    }
};
const verifyOtp = async (req, res) => {
    try {
        const { id } = req.params;
        const { otp } = req.body;

        const [orders] = await db.promise().query(
            `
            SELECT *
            FROM orders
            WHERE id = ?
            `,
            [id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const order = orders[0];

        if (order.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        await db.promise().query(
            `
            UPDATE orders
            SET status = 'delivered'
            WHERE id = ?
            `,
            [id]
        );

        res.json({
            message: "Order delivered successfully"
        });

    } catch (err) {
        res.status(500).json(err);
    }
};
const getMyOrders = async (req, res) => {
    try {
        const { user_id } = req.params;
        const [orders] = await db.promise().query(
            `
           SELECT
                o.id,
                o.pickup_time,
                o.otp,
                o.status,
                o.payment_status,
                o.total_amount,
                o.payment_method,
                MIN(f.food_image) AS food_image,
                GROUP_CONCAT(
                    CONCAT(f.name, ' x', oi.quantity)
                    SEPARATOR ', '
                ) AS itemsText
            FROM orders o
            JOIN order_items oi
                ON o.id = oi.order_id
            JOIN food_items f
                ON oi.food_id = f.id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.id DESC
            `,
            [user_id]
        );

        res.json(orders);

    } catch (err) {
        res.status(500).json(err);
    }
};
const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_status } = req.body;

        if (!["pending", "paid"].includes(payment_status)) {
            return res.status(400).json({
                message: "Invalid payment status"
            });
        }

        const [result] = await db.promise().query(
            `
            UPDATE orders
            SET payment_status = ?
            WHERE id = ?
            `,
            [payment_status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Payment status updated successfully"
        });

    } catch (err) {
        res.status(500).json(err);
    }
};
const getOrderSuccessChart = async (req, res) => {
  try {

    const [delivered] = await db.promise().query(`
      SELECT COUNT(*) AS count
      FROM orders
      WHERE status = 'delivered'
    `);

    const [pending] = await db.promise().query(`
      SELECT COUNT(*) AS count
      FROM orders
      WHERE status = 'pending'
    `);

    const [preparing] = await db.promise().query(`
      SELECT COUNT(*) AS count
      FROM orders
      WHERE status IN ('accepted','preparing','ready')
    `);

    const [cancelled] = await db.promise().query(`
      SELECT COUNT(*) AS count
      FROM orders
      WHERE status = 'cancelled'
    `);

    res.json({
      delivered: delivered[0].count,
      pending: pending[0].count,
      preparing: preparing[0].count,
      cancelled: cancelled[0].count
    });

  } catch (err) {
    res.status(500).json(err);
  }
};
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const [order] = await db.promise().query(
            "SELECT * FROM orders WHERE id = ?",
            [id]
        );
        if (order.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        const [items] = await db.promise().query(
            `
            SELECT
                oi.id,
                oi.food_id,
                fi.name,
                oi.quantity,
                oi.subtotal,
                fi.food_image,
            FROM order_items oi
            JOIN food_items fi
                ON oi.food_id = fi.id
            WHERE oi.order_id = ?
            `,
            [id]
        );

        res.json({
            order: order[0],
            items
        });

    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = { placeOrder, getAllOrders, getOrderById, updateOrderStatus, verifyOtp, getMyOrders, updatePaymentStatus, formatTime,getTopSellingItems,getOrderSuccessChart };