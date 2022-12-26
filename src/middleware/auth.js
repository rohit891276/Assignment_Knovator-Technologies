const jwt = require("jsonwebtoken");
const PostModel = require("../models/postModel.js");
const AdminModel = require("../models/adminModel.js");


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

    let userId = req.params.userId;

    let decodedToken = req.decodedToken;

    let tokenUserId = decodedToken.userId;
    console.log(tokenUserId)

    let findUserId = await PostModel.findOne({ userId: userId }).select({ userId: 1 });

    if (!findUserId)
      return res.status(400).send({ status: false, message: `Post with userId ${userId} is not  available` });
    let newAuth = findUserId.userId.toString();
    console.log(newAuth)
    if (tokenUserId !== newAuth)
      return res.status(403).send({ status: false, message: "Unauthorize User" });

    next();

  } catch (error) {
    res.status(500).send({ Status: false, message: error.message });
  }
};


//!-------------------------------------------------------------------------------------------------------------------------------


const authenticateAdmin = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token)
      return res.status(400).send({ status: false, message: "token must be present" });

    jwt.verify(token, "Admin-Control", function (err, decoded) {
      if (err) {
        return res.status(401).send({ status: false, message: err.message })
      } else {
        req.decodedAdminToken = decoded
        next()
      }
    });
  } catch (error) {
    res.status(500).send({ Status: false, message: error.message });
  }
};


const authoriseAdmin = async function (req, res, next) {
  try {
    token = req.headers["x-api-key"];

    let adminId = req.params.adminId;
    console.log(adminId)

    let decodedAdminToken = req.decodedAdminToken;

    let tokenAdminId = decodedAdminToken.adminId;
    console.log(tokenAdminId)

    let findAdmin = await AdminModel.findOne({ _id: adminId }).select({ _id: 1 })
    console.log(findAdmin);
    
    if (!findAdmin)
      return res.status(400).send({ status: false, message: `Admin with adminId ${adminId} is not  available` });

    if (tokenAdminId !== adminId)
      return res.status(403).send({ status: false, message: "Unauthorize Admin" });

    next();

  } catch (error) {
    res.status(500).send({ Status: false, message: error.message });
  }
};

module.exports = { authenticate, authorise, authenticateAdmin, authoriseAdmin }