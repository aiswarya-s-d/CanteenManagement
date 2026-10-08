const db = require("../config/db");
const getProfile = (req, res) => {
    const userId = req.user.id;
    const sql = `
        SELECT
        id,
        name,
        email,
        department,
        year,
        gender
        FROM users
        WHERE id = ?
    `;
    db.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json(result[0]);
    });
};
const getDashboardStats = (req, res) => {
    const userId = req.user.id;
    const ordersTodayQuery = `
        SELECT COUNT(*) AS ordersToday
        FROM orders
        WHERE user_id = ?
        AND DATE(pickup_time) = CURDATE()
    `;
    const todaysSpendQuery = `
        SELECT COALESCE(SUM(total_amount),0) AS todaysSpend
        FROM orders
        WHERE user_id = ?
        AND DATE(pickup_time) = CURDATE()
    `;
    const otpQuery = `
    SELECT otp
    FROM orders
    WHERE user_id = ?
    AND DATE(pickup_time) = CURDATE()
    ORDER BY id DESC
    LIMIT 1
    `;
    db.query(ordersTodayQuery, [userId], (err, ordersResult) => {

        if (err) return res.status(500).json(err);

        db.query(todaysSpendQuery, [userId], (err, spendResult) => {

            if (err) return res.status(500).json(err);

            db.query(otpQuery, [userId], (err, otpResult) => {

                if (err) return res.status(500).json(err);

                res.json({
                    ordersToday: ordersResult[0].ordersToday,
                    todaysSpend: spendResult[0].todaysSpend,
                    pickupOtp:
                        otpResult.length > 0
                            ? otpResult[0].otp
                            : "----"
                });

            });

        });

    });

};
const getAdminDashboardStats = async (req, res) => {
  try {
    const [ordersResult] =
      await db.promise().query(`
        SELECT COUNT(*) AS totalOrders
        FROM orders
        WHERE DATE(pickup_time) = CURDATE()
      `);
    const [revenueResult] =
      await db.promise().query(`
        SELECT COALESCE(SUM(total_amount),0) AS totalRevenue
        FROM orders
        WHERE DATE(pickup_time) = CURDATE()
      `);
    const [usersResult] =
    await db.promise().query(`
        SELECT COUNT(DISTINCT user_id) AS activeUsers
        FROM orders
        WHERE DATE(pickup_time) = CURDATE()
    `);
    const [pendingResult] =
      await db.promise().query(`
        SELECT COUNT(*) AS pendingOrders
        FROM orders
        WHERE DATE(pickup_time) = CURDATE()
        AND status = 'Pending'
      `);
    res.json({
      totalOrders:
        ordersResult[0].totalOrders,
      totalRevenue:
        revenueResult[0].totalRevenue,
      activeUsers:
        usersResult[0].activeUsers,
      pendingOrders:
        pendingResult[0].pendingOrders
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports = {
    getProfile,getDashboardStats,getAdminDashboardStats
};