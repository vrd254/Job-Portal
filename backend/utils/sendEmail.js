import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text, html = null) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Job Finder" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: html || undefined, // Optional: HTML content
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error);
    }
};
