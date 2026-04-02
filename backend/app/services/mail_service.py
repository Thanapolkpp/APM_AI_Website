import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

MAIL_EMAIL = os.getenv("MAIL_EMAIL", "")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def send_reset_password_email(to_email: str, token: str):
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "รีเซ็ตรหัสผ่าน - Gen Z AI"
    msg["From"] = MAIL_EMAIL
    msg["To"] = to_email

    html_body = f"""
    <html>
      <body style="font-family: sans-serif; padding: 20px;">
        <h2>รีเซ็ตรหัสผ่านของคุณ</h2>
        <p>เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชีนี้</p>
        <p>คลิกปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่ ลิงก์นี้จะหมดอายุใน <strong>15 นาที</strong></p>
        <a href="{reset_link}"
           style="display:inline-block; padding:12px 24px; background:#6C63FF;
                  color:white; text-decoration:none; border-radius:8px; margin:16px 0;">
          ตั้งรหัสผ่านใหม่
        </a>
        <p style="color:#888; font-size:12px;">
          หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน ให้เพิกเฉยต่ออีเมลนี้ได้เลย
        </p>
      </body>
    </html>
    """

    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(MAIL_EMAIL, MAIL_PASSWORD)
        server.sendmail(MAIL_EMAIL, to_email, msg.as_string())
