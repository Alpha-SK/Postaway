// controllers/otpController.js
import { generate } from "randomstring";
import sendEmail from "./sendEmail.js";
import OtpRepository from "./otp.repository.js";

export default class OtpController {
  constructor() {
    this.otpRespoitory = new OtpRepository();
  }

  // Generate OTP
  async generateOTP() {
    return generate({
      length: 6,
      charset: "numeric",
    });
  }

  // Send OTP to the provided email
  async sendOTP(req, res, next) {
    try {
      const { email } = req.query;
      const otp = generateOTP(); // Generate a 6-digit OTP
      const newOTP = await this.otpRespoitory.sendOTP(email, otp);
      console.log(newOTP);

      // Send OTP via email
      await sendEmail({
        to: email,
        subject: "Your OTP",
        message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
      });

      res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // Verify OTP provided by the user
  async verifyOTP(req, res, next) {
    try {
      const { email, otp } = req.query;

      const existingOTP = await this.otpRespoitory.verifyOTP(email, otp);

      if (existingOTP) {
        // OTP is valid
        res
          .status(200)
          .json({ success: true, message: "OTP verification successful" });
      } else {
        // OTP is invalid
        res.status(400).json({ success: false, error: "Invalid OTP" });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
}