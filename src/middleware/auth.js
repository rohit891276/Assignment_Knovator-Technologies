const jwt = require("jsonwebtoken");
const PostModel = require("../models/postModel.js");


const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token)
      return res.status(400).send({ status: false, message: "token must be present" });

    jwt.verify(token, "Assignment-Knovator", function (err, decoded) {
      if (err) {
        return res.status(401).send({ status: false, message: err.message })
      } else {
        req.decodedToken = decoded
        next()
      }
    });
  } catch (error) {
    res.status(500).send({ Status: false, message: error.message });
  }
};


const authorise = async function (req, res, next) {
  try {
    token = req.headers["x-api-key"];
    let postId = req.params.postId;

    let decodedToken = req.decodedToken;

    let userId = decodedToken.userId;

    let findPost = await PostModel.findOne({ userId: userId, _id: postId })

    if (!findPost)
      return res.status(403).send({ status: false, message: "Unauthorized User" });
    next();

  } catch (error) {
    res.status(500).send({ Status: false, message: error.message });
  }
};

module.exports = { authenticate, authorise }