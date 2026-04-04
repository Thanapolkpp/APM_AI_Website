import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

MAIL_EMAIL = os.getenv("MAIL_EMAIL", "")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def send_reset_password_email(to_email: str, token: str):
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "🔐 กู้คืนรหัสผ่าน - APM Assistant AI"
    msg["From"] = f"APM Assistant AI <{MAIL_EMAIL}>"
    msg["To"] = to_email

    # แนะนำให้ใช้ URL ที่เป็น Public สำหรับรูปภาพในอีเมล
    logo_url = "https://raw.githubusercontent.com/Thanapolkpp/AI_Myfriend/main/frontend/src/assets/logo.png"

    html_body = f"""
    <html>
      <body style="font-family: 'Inter', -apple-system, sans-serif; padding: 40px 20px; background-color: #ffffff; color: #1a1a1a; margin: 0;">
        <div style="max-width: 500px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 32px; padding: 48px 32px; text-align: center;">
          
          <!-- Logo Section -->
          <div style="margin-bottom: 32px;">
            <img src="{logo_url}" alt="APM Assistant" style="width: 80px; height: 80px; border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05);">
          </div>

          <h2 style="font-size: 26px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 12px; color: #000000;">กู้คืนรหัสผ่านของคุณ</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #666666; margin-bottom: 32px;">
            เราได้รับคำขอให้รีเซ็ตรหัสผ่านสำหรับบัญชีที่เชื่อมโยงกับอีเมลนี้ <br>คุณสามารถตั้งรหัสผ่านใหม่ได้ทันทีผ่านปุ่มด้านล่างนี้เลยครับ
          </p>

          <!-- Action Button -->
          <div style="margin-bottom: 40px;">
            <a href="{reset_link}"
               style="display:inline-block; padding:18px 40px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 20px; font-weight: 700; font-size: 16px;">
              ตั้งรหัสผ่านใหม่ที่นี่
            </a>
          </div>

          <!-- Security Notice -->
          <div style="background-color: #f7f7f7; border-radius: 20px; padding: 20px; margin-bottom: 32px; text-align: left;">
            <p style="font-size: 13px; color: #888888; margin: 0; line-height: 1.5;">
              ⚠️ <b>ความปลอดภัย:</b> ลิงก์นี้จะหมดอายุภายใน 15 นาที เพื่อความปลอดภัยของคุณ หากคุณไม่ได้ทำรายการนี้ สามารถเพิกเฉยต่ออีเมลนี้ได้ทันทีครับ
            </p>
          </div>

          <p style="font-size: 11px; color: #cccccc; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">
            APM ASSISTANT AI • GEN Z TEAM 🌷
          </p>
        </div>
      </body>
    </html>
    """

    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(MAIL_EMAIL, MAIL_PASSWORD)
        server.sendmail(MAIL_EMAIL, to_email, msg.as_string())
