const cron = require('node-cron');
const nodemailer = require('nodemailer');
const config = require('../config/config');
// const mail = require('./../mail/mail');
const db = require('./db')
async function getAllUsers() {
    try {
        const [rows] = await db.query('SELECT * FROM mail Where `status`=1');
        return rows;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Rethrow the error for further handling
    }
}

async function scheduleNotify() {
    const users = await getAllUsers();
    users.forEach(element => {
        const yearString = new Date(element.time).toLocaleString().split(',')[0].split('/')
        const timeString = new Date(element.time).toLocaleString().split(',')[1]
        const [hour, minute, second] = timeString.split(':');
        const isPM = timeString.includes('PM');
        let hour24 = parseInt(hour, 10);
        if (isPM && hour24 !== 12) {
            hour24 += 12;
        }

        const time = second.replace("PM" || "AM", "") + '' + minute + ' ' + hour24.toString().padStart(2, '0') + ' ' + yearString[1] + ' ' + yearString[0] + ' *';
        console.log(time);

        cron.schedule(time, async () => {
            console.log('Notification: It\'s ' + element.time + ' Time to take action.');
            // await mail.Mail(req, res);
            await updateSchedule(element)
            scheduleNotify()
        });
    });
}
async function updateSchedule(res) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.Email,
                pass: config.Mail_key
            }
        });

        const mailOptions = {
            from: config.Email,
            to: res.mail,
            subject: 'testing',
            text: res.content
        };

        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                await db.query("UPDATE `mail` SET `status`='2' WHERE `id`=" + res.id)
                return true
            } else {
                await db.query("UPDATE `mail` SET `status`='2' WHERE `id`=" + res.id)
                return true
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

(async () => {
    scheduleNotify()
})();

exports.createSchedule = async (req, res) => {
    try {
        const sql = "INSERT INTO `mail`( `mail`, `time`, `status`, `content`) VALUES ('" + req.body.to + "','" + req.body.time + "','1','" + req.body.msg + "')";
        await db.query(sql);
        scheduleNotify()
        return res.status(200).send({ 'massage': 'Email sent' });
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

exports.getScheduleList = async (req, res) => {
    try {
        const sql = "SELECT * FROM mail WHERE status=1";
        const [results, fields] = await db.query(sql);
        return res.status(200).send({ 'massage': true, 'data': results });
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}