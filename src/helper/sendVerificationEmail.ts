import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailContent = `
      <!DOCTYPE html>
      <html lang="en" dir="ltr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
            body {
              font-family: 'Roboto', Verdana, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .heading {
              color: #333;
            }
            .otp {
              font-size: 1.5em;
              font-weight: bold;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="heading">Hello ${username},</h2>
            <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
            <p class="otp">${verifyCode}</p>
            <p>If you did not request this code, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;
    await transporter.sendMail({
      from: '"Mystery Message" <onboarding@mysteryapp.com>',
      to: email,
      subject: "Mystery message | Verification Code",
      html: emailContent,
    });

    return { success: true, message: "Verification email sent." };
  } catch (emailError) {
    console.log("Error in sending verification email.", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
