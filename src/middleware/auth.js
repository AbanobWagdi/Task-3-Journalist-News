const jwt = require("jsonwebtoken");
const Journalist = require("../models/journalist");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "nodecourse");
    const journalist = await Journalist.findOne({
      _id: decode._id,
      tokens: token,
    });
    if (!journalist) {
      throw new Error();
    }
    req.journalist = journalist;

    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};
module.exports = auth;
