const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    teamname: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: value => /^[a-zA-Z\s]{3,20}$/.test(value),
            message: 'Teamname is not valid',
           
        },
    },
    name: [{
        type: String,
        required: true,
        validate: {
            validator: value => /^[a-zA-Z\s]{3,20}$/.test(value),
            message: 'Username is not valid',
        },
    }],
    email: [{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: value => /^[a-z]+[0-9.]+@akgec\.ac\.in$/.test(value),
            message: 'Email is not valid or does not belong to akgec.ac.in domain',
        },
    }],
    contactNumber: [{
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: value => /^[6789]\d{9}$/.test(value),
            message: 'Phone number is not correct',
        },
    }],
    gender: [{
        type: String,
        required: true,
        enum: ['MALE', 'FEMALE', 'OTHER'],
        default: 'MALE'
    }],
    studentId: [{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: value => /^(21|22|23)\d{5,6}(d|D)?$/.test(value),
            message: 'Student Id is not valid',
        },
    }],
    residence: [{
        type: String,
        enum: ['HOSTELER', 'DAY SCHOLAR'],
        default: 'HOSTELER',
        required: true,
    }],
    currentYear: [{
        type: Number,
        enum: [1, 2 , 3],
        default: 1,
        required: true,
    }],
    branch: [{
        type: String,
        required: true,
        enum: ['CSE','CSE-AIML','CSE-DS','CS','IT','CSIT','CS-Hindi','ECE','ME','EN','CIVIL']
    }]
}, 
{
    timestamps: true
});

['name', 'email', 'contactNumber', 'gender', 'studentId', 'residence', 'currentYear', 'branch'].forEach(field => {
    UserSchema.path(field).validate(function(value) {
        return value.length === 3;
    }, `Three ${field} are required`);
});

module.exports = mongoose.model('User', UserSchema);