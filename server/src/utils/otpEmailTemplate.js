const otpEmailTemplate = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>

  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="20">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#fff;border-radius:10px;overflow:hidden;">

            <tr>
              <td align="center"
                style="background:#2563eb;color:#fff;padding:25px;">
                <h1 style="margin:0;">Email Verification</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:35px;color:#333;">

                <h2>Hello ${name}, 👋</h2>

                <p>
                  Thank you for registering. Use the OTP below to verify your
                  email address.
                </p>

                <div
                  style="
                    background:#f3f4f6;
                    padding:20px;
                    border-radius:8px;
                    text-align:center;
                    margin:30px 0;
                  ">
                  <span
                    style="
                      font-size:32px;
                      font-weight:bold;
                      letter-spacing:8px;
                      color:#2563eb;
                    ">
                    ${otp}
                  </span>
                </div>

                <p>This OTP is valid for <strong>5 minutes</strong>.</p>

                <p>
                  If you didn't request this verification, you can safely ignore
                  this email.
                </p>

              </td>
            </tr>

            <tr>
              <td
                align="center"
                style="background:#f8f8f8;padding:20px;font-size:13px;color:#666;">
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

export default otpEmailTemplate;
