import nodemailer from 'nodemailer';
  
const sendOTPEmail = (email_to: string, otp: number) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: "OAuth2",
        user: process.env.Coordonate_Email,
        clientId: process.env.GoogleClientId,
        clientSecret: process.env.GoogleClientSecret,
        refreshToken: process.env.GooglePlayGroundRefreshToken
      },
    });

    const mailOptions = {
      from: process.env.Coordonate_Email,
      to: email_to,
      subject: 'Password Reset',
      text: `Your one-time password (OTP) for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent:', info.response);
        resolve(info.response);
      }
    });
  });
};


export default sendOTPEmail;