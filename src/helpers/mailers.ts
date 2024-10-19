import User from '@/models/User';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'


interface SendEmailParams {
    email: string;
    emailType: 'VERIFY' | 'RESET';
    userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
    try {
        // TODO: configure mail for usage

        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        console.log("Send Email : ", hashedToken)

        // const hashedToken = "abc123"
        console.log("MAIL", userId);
        console.log("EMAIL TYPE", emailType);
        console.log(typeof emailType);

        if (emailType == "VERIFY") {
            console.log("VERIFY SECTION")
            const updatedUser = await User.findByIdAndUpdate(userId, {
                $set: {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000 // expires in 60min from now
                }
            });
            console.log("Updated User for VERIFY", updatedUser)
        }
        else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    forgetPasswordToken: hashedToken,
                    forgetPasswordTokenExpiry: new Date(Date.now() + 3600000) // expires in 60min from now
                }
            });
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "616dad4985bdc9",
                pass: "47d48917d85ff7"
            }
        });

        const mailOptions = {
            from: 'anujverma3553@gmail.com', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/${emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword'}?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"} or copy and paste the link below in your browser.
            <br> ${process.env.DOMAIN}/${emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword'}?token=${hashedToken}
            </p>`,
        };

        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}