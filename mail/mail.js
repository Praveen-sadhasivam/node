const nodemailer = require('nodemailer');
const config = require('../config/config');
const validator = require("email-validator");
const db = require('../config/db')
exports.Mail = async (req, res) => {
    try {
        const {toemail,subject,text,id}=req.body
        if (toemail == "") {
            res.status(403).send({ 'massage': 'Email Empty' })
            return
        }
        if (subject == "") {
            res.status(403).send({ 'massage': 'Subject Empty' })
            return
        }
        if (text == "") {
            res.status(403).send({ 'massage': 'Text Empty' })
            return
        }
        if (!validator.validate(toemail)) {
            res.status(403).send({ 'massage': 'invalid Email' })
            return
        }
        const [results, fields] = await db.query('SELECT * FROM `movie` WHERE `id`=' + id + ' AND `status`=1')
        const msg = 'Ticket Bocked for ' + results[0]['name']
        if (results) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.Email,
                    pass: config.Mail_key
                }
            });

            const mailOptions = {
                from: config.Email,
                to: req.body.toemail,
                subject: req.body.subject,
                text: msg
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.status(200).send(error)
                } else {
                    res.status(200).send({ 'massage': 'Email sent: ' + info.response });
                }
            });
        }
    } catch (err) {
        res.status(500).send({ 'massage': 'Internal Server Error' });
    }
}
