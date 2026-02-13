const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true only for 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

/* Verify SMTP once on startup */
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP connection failed:', error)
    } else {
        console.log('✅ SMTP server ready')
    }
})

exports.sendMail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
            to,
            subject,
            html
        })

        console.log('📧 Email sent:', info.messageId)
        return true
    } catch (err) {
        console.error('❌ Email error:', err)
        return false
    }
}
