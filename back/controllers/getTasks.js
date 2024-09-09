const database = require('../database/database'); // database.js import 

exports.getTasks = async(req, res) => {
  const userId = req.params.userId;

  try {
    const result = await database.query(`SELECT * FROM task WHERE userId = $1 ORDER BY created_at DESC`, [userId]); // SQL injection 공격 예방을 위함
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
};
