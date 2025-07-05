import nodemailer from 'nodemailer'
import path from 'path'

const sendVerificationCodeEmail = async (emailData) => {
    const {default: hbs} = await import('nodemailer-express-handlebars');

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST_MAILJET,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER_MAILJET,
            pass: process.env.SMTP_PASS_MAILJET,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const handlerOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.resolve('./emailViews'),
            defaultLayout: false
        },
        viewPath: path.resolve('./emailViews'),
        extName: '.handlebars',
    };

    transporter.use('compile', hbs(handlerOptions));

    const {sendFrom, sendTo, replyTo, subject, template, name, verificationCode, logoUrl} = emailData;
    const year = new Date().getFullYear();

    const options = {
        from: sendFrom,
        to: sendTo,
        replyTo: replyTo,
        subject: subject,
        template: template,
        context: {
            name,
            verificationCode,
            year,
            logoUrl,
        }
    };

    await transporter.sendMail(options, function (err, info) {
        if (err) {
            console.error(err)
        } else {
            console.log('Email sent:', info)
        }
    })

}

export {
    sendVerificationCodeEmail
}