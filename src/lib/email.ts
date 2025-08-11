import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`;

    console.log('Attempting to send email...');
    console.log('To:', email);
    console.log('Verification URL:', verificationUrl);
    console.log('API Key present:', !!process.env.RESEND_API_KEY);

    try {
        await resend.emails.send({
            from: "Schema Builder <noreply@sengar.app>",
            to: email,
            subject: "Verify your email address",
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
                    <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Welcome to Schema Builder!</h2>
                        <p style="color: #666; line-height: 1.6;">Thank you for registering. Please click the button below to verify your email address and activate your account:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" 
                               style="background-color: #007bff; color: white; padding: 14px 28px; 
                                      text-decoration: none; border-radius: 6px; display: inline-block;
                                      font-weight: 500; font-size: 16px;">
                                Verify Email Address
                            </a>
                        </div>
                        
                        <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #007bff; font-size: 14px; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 12px; margin: 0;">
                                This verification link will expire in 24 hours. If you didn't create this account, you can safely ignore this email.
                            </p>
                        </div>
                    </div>
                </div>
            `,
        });

        console.log(`Verification email sent successfully to ${email}`);
    } catch (error) {
        console.error(`Error sending verification email to ${email}:`, error);
        throw new Error(`Failed to send verification email to ${email}`);
    }
}