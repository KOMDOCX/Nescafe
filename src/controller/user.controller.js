const User = require('../models/userSchema');
const { trim } = require('validator');
const axios = require("axios");
const ApiError = require("../utils/Apierror");
const Apiresponse = require('../utils/Apiresponse');
const emailsent = require("../utils/email");

const Registration = async (req, res) => {

    const secretKey = process.env.SECRET_KEY;

    const { teamname, name, email, contactNumber, gender, studentId, residence, currentYear, token, branch } = req.body;

    if (!token) {
        return res.status(401).json(new Apiresponse(401, null, 'Token is required for verification'));
    }

    if (token) {
        const verifyurl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
        const response = await axios.post(verifyurl);

        if (response.data.success) {
            const fields = { teamname, name, email, contactNumber, gender, studentId, residence, currentYear, token, branch };

            if (Object.values(fields).some((field) => {
                if (field === undefined || field === null) {
                    return true; // Field is undefined or null
                }
                return field.toString().trim() === "";
            })) {
                throw new ApiError(400, "Fill in all the details");
            }

            const existingUser = await User.findOne({
                $or: [{ email }, { studentId }, { contactNumber }, { teamname }]
            });

            if (existingUser) {
                return res.status(402).json(new Apiresponse(402, null, "User already registered"));
            }

            try {
                const user = await User.create({
                    teamname,
                    name,
                    email,
                    contactNumber,
                    gender,
                    studentId,
                    residence,
                    currentYear,
                    branch
                });

                emailsent.sendMail(user.email);

                return res.json(new Apiresponse(200, user, "User successfully registered. Check your email."));
            } catch (error) {//This is used to produce a error on postman
                if (error.name === 'ValidationError') {
                    const errors = {};
                    for (const field in error.errors) {
                        errors[field] = error.errors[field].message;
                    }
                    return res.status(400).json(new Apiresponse(400, null, errors));
                } else {
                    throw error;
                }
            }
        } else {
            return res.status(403).json(new Apiresponse(403, null, "Invalid Recaptcha"));
        }
    }
}

module.exports = {
    Registration
};
