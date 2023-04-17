const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aswin0509.aw@gmail.com', // Email Sender
        pass: 'skyzkvprkikmmthp' // Key Generate
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter