const UserModel = require('../models/userModel.js');
const jwt = require("jsonwebtoken");

const { isValid, isValidRequest, nameRegex, mailRegex, passwordRegex } = require('../validator/validations.js')

const createUser = async function (req, res) {
    try {
        // validation for empty body
        if (!isValidRequest(req.body))
            return res.status(400).send({ status: false, message: "Request body cannot remain empty" });

        let { fname, lname, email, password } = req.body;

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
        if (!isValid(email))
            return res.status(400).send({ status: false, message: "EmailId must be present" });
        if (!mailRegex(email))
            return res.status(400).send({ status: false, message: "Please enter valid email" });
        const checkUser = await UserModel.findOne({ email: email });
        if (checkUser) {
            return res.status(400).send({ status: false, message: "EmailId already taken" });
        }

        // validation for password
        if (!isValid(password))
            return res.status(400).send({ status: false, message: "Password must be present" });
        if (!passwordRegex(password))
            return res.status(400).send({ status: false, message: "Please enter a password which contains min 8 letters & max 15 letters, at least a symbol, upper and lower case letters and a number" });

        // creating collection in DB
        const savedData = await UserModel.create(req.body);
        return res.status(201).send({ status: true, message: 'Success', data: savedData })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}

const loginUser = async function (req, res) {
    try {
        // validation for empty body
        if (!isValidRequest(req.body))
            return res.status(400).send({ status: false, message: "Request body cannot remain empty" });

        const { email, password } = req.body;
        // validation for email
        if (!isValid(email) || !isValid(password))
            return res.status(400).send({ status: false, message: "Credential must be present" });

        // find email in DB
        let user = await UserModel.findOne({ email: email });
        if (!user)
            return res.status(400).send({ status: false, message: "Credential is not correct", });

        // token generation
        let token = jwt.sign(
            {
                userId: user._id.toString(),
            },
            "Assignment-Knovator",
            {
                expiresIn: '1h'
            }
        );
        const finalData = {};
        finalData.userId = user._id;
        finalData.token = token
        res.status(200).send({ status: true, message: "User login successfull", data: finalData });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
module.exports = { createUser, loginUser }


