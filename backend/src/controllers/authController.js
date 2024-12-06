const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const login = async (req, res) => {
  const { username, senha } = req.body;

  try {
    const user = await db.oneOrNone(
      "SELECT username, senha, tipousuario FROM usuario WHERE username = $1;",
      [username]
    );

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }
    console.log(user.senha);
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    const token = jwt.sign(
      { username: user.username, tipousuario: user.tipousuario },
      "your-secret-key",
      { expiresIn: "1h" }
    );

    res.json({ token, user: { username: user.username, tipousuario: user.tipousuario } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no login." });
  }
};

module.exports = { login };