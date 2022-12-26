
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/adminModel.js");

const { isValid, isValidRequest, nameRegex, mailRegex, passwordRegex } = require('../validator/validations.js')


const createAdmin = async function (req, res) {
    try {
        // validation for empty body
        if (!isValidRequest(req.body))
            return res.status(400).send({ status: false, message: "Request body cannot remain empty" });

        let { fname, lname, adminEmail, adminPassword } = req.body;

        // validation for fname
        if (!isValid(fname))
            return res.status(400).send({ status: false, message: "fname must be present" })
        if (!nameRegex(fname))
            return res.status(400).send({ status: false, message: "Please provide valid fname, it should not contains any special characters and numbers" });

        // validation for lname
        if (!isValid(lname))
            return res.status(400).send({ status: false, message: "lname must be present" })
        if (!nameRegex(lname))
            return res.status(400).send({ status: false, message: "Please provide valid lname, it should not contains any special characters and numbers" });

        // validation for email
        if (!isValid(adminEmail))
            return res.status(400).send({ status: false, message: "EmailId must be present" });
        if (!mailRegex(adminEmail))
            return res.status(400).send({ status: false, message: "Please enter valid adminEmail" });
        const checkUser = await AdminModel.findOne({ adminEmail: adminEmail });
        if (checkUser) {
            return res.status(400).send({ status: false, message: "adminEmail already taken" });
        }

        // validation for adminPassword
        if (!isValid(adminPassword))
            return res.status(400).send({ status: false, message: "adminPassword must be present" });
        if (!passwordRegex(adminPassword))
            return res.status(400).send({ status: false, message: "Please enter a adminPassword which contains min 8 letters & max 15 letters, at least a symbol, upper and lower case letters and a number" });

        // creating collection in DB
        const savedData = await AdminModel.create(req.body);
        return res.status(201).send({ status: true, message: 'Success', data: savedData })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}

const loginAdmin = async function (req, res) {
    try {
        // validation for empty body
        if (!isValidRequest(req.body))
            return res.status(400).send({ status: false, message: "Request body cannot remain empty" });

        const { adminEmail, adminPassword } = req.body;
        // validation for adminEmail
        if (!isValid(adminEmail) || !isValid(adminPassword))
            return res.status(400).send({ status: false, message: "Credential must be present" });

        // find adminEmail in DB
        let admin = await AdminModel.findOne({ adminEmail: adminEmail });
        if (!admin)
            return res.status(400).send({ status: false, message: "Credential is not correct", });

        // token generation
        let token = jwt.sign(
            {
                adminId: admin._id.toString(),
            },
            "Admin-Control",
            {
                expiresIn: '1h'
            }
        );
        const finalData = {};
        finalData.adminId = admin._id;
        finalData.token = token
        res.status(200).send({ status: true, message: "Admin login successfull", data: finalData });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
module.exports = { createAdmin, loginAdmin }