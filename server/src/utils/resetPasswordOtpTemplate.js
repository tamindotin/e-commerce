const resetPasswordOtpTemplate = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP</title>
  </head>

  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

      <table width="100%" cellpadding="20" cellspacing="0">
          <tr>
              <td align="center">

                  <table width="600" cellpadding="0" cellspacing="0"
                      style="background:#ffffff;border-radius:10px;overflow:hidden;">

                      <!-- Header -->
                      <tr>
                          <td align="center"
                              style="background:#dc2626;color:#ffffff;padding:25px;">
                              <h1 style="margin:0;">Password Reset Request</h1>
                          </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                          <td style="padding:35px;color:#333333;">

                              <h2 style="margin-top:0;">Hello ${name}, 👋</h2>

                              <p style="font-size:16px;line-height:1.6;">
                                  We received a request to reset your account password.
                                  Use the OTP below to continue.
                              </p>

                              <div
                                  style="
                                      margin:30px 0;
                                      background:#f3f4f6;
                                      padding:20px;
                                      border-radius:8px;
                                      text-align:center;
                                  ">

                                  <span
                                      style="
                                          font-size:32px;
                                          font-weight:bold;
                                          letter-spacing:8px;
                                          color:#dc2626;
                                      ">
                                      ${otp}
                                  </span>

                              </div>

                              <p style="font-size:15px;">
                                  <strong>This OTP is valid for 5 minutes.</strong>
                              </p>

                              <p style="font-size:15px;">
                                  If you did not request a password reset,
                                  please ignore this email. Your password will
                                  remain unchanged.
                              </p>

                              <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;">

                              <p style="font-size:13px;color:#666;">
                                  For your security, never share this OTP with anyone.
                                  Our team will never ask you for it.
                              </p>

                          </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                          <td align="center"
                              style="background:#f8f8f8;padding:20px;color:#777;font-size:13px;">
                              © 2026 Your App. All rights reserved.
                          </td>
                      </tr>

                  </table>

              </td>
          </tr>
      </table>

  </body>
  </html>
  `;
};

module.exports = resetPasswordOtpTemplate;
