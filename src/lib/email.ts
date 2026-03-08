import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'admin@example.com',
        pass: process.env.EMAIL_PASS || 'your_app_password',
    },
});

export const sendAdminOrderNotification = async (orderData: any, orderId: string) => {
    try {
        const recipients = [
            'support@blueteeth.store',
            'storeblueteeth@gmail.com'
        ].join(', ');

        const mailOptions = {
            from: process.env.EMAIL_USER || 'admin@example.com',
            to: recipients,
            subject: `🚀 New Order Received: ${orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #0056D2; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">New Order Alert!</h2>
                    <p style="font-size: 16px; color: #333;">Hello Admin, you have received a new order from your application.</p>
                    
                    <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h3 style="color: #333; margin-top: 0;">Order Summary</h3>
                        <p><strong>Order ID:</strong> ${orderId}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                        <p><strong>Customer Name:</strong> ${orderData.customer?.name || 'N/A'}</p>
                        <p><strong>Customer Phone:</strong> ${orderData.customer?.mobile || 'N/A'}</p>
                        <p><strong>Shipping Address:</strong> ${orderData.customer?.address || 'N/A'}, ${orderData.customer?.city || 'N/A'}</p>
                        <p><strong>Total Amount:</strong> ₹${orderData.total?.toLocaleString()}</p>
                    </div>

                    <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h3 style="color: #333; margin-top: 0;">Items Ordered</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${orderData.items.map((item: any) => `
                                <li style="border-bottom: 1px solid #eee; padding: 10px 0;">
                                    <strong>${item.name}</strong><br/>
                                    Quantity: ${item.quantity} | Price: ₹${item.price.toLocaleString()}
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <p style="margin-top: 30px; font-size: 14px; color: #777; text-align: center;">
                        To fulfill this order, login to your Admin Dashboard or Godown Management System.
                    </p>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Admin notification email sent successfully", result.messageId);
        return { success: true };
    } catch (error) {
        console.error("Failed to send admin notification email:", error);
        return { success: false, error };
    }
};

export const sendAdminWhatsAppNotification = async (orderData: any, orderId: string) => {
    // In a real app, this should securely call a WhatsApp Business API
    try {
        const adminPhone = process.env.WHATSAPP_ADMIN_PHONE || '+919999578292';
        const apiKey = process.env.WHATSAPP_API_KEY; // CallMeBot API Key

        if (!adminPhone || !apiKey) {
            console.warn("⚠️ WhatsApp API credentials missing. Please add WHATSAPP_ADMIN_PHONE and WHATSAPP_API_KEY to .env.local");
            return { success: false, error: "Missing WhatsApp credentials" };
        }

        // Creating a beautifully formatted notification text
        let message = `🚀 *NEW ORDER ALERT - BLUETEETH* 🚀\n\n`;
        message += `*Order ID:* ${orderId}\n`;
        message += `*Amount:* ₹${orderData.total?.toLocaleString()}\n`;
        message += `*Customer:* ${orderData.customer?.name} (${orderData.customer?.mobile})\n`;
        message += `*City:* ${orderData.customer?.city}\n\n`;

        message += `*Items Ordered:*\n`;
        orderData.items.forEach((item: any, idx: number) => {
            message += `${idx + 1}. ${item.name} (x${item.quantity}) - ₹${item.price.toLocaleString()}\n`;
        });

        message += `\n_Please check the Admin Panel for full details._`;

        // URL encode the message for the API call
        const encodedMessage = encodeURI(message);
        const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodedMessage}&apikey=${apiKey}`;

        const response = await fetch(url, { method: 'GET' });

        if (response.ok) {
            console.log("WhatsApp Admin notification sent successfully!");
            return { success: true };
        } else {
            console.error("Failed to send WhatsApp message. Status:", response.status);
            return { success: false, error: "Failed to send WhatsApp message" };
        }
    } catch (error) {
        console.error("WhatsApp Integration Error:", error);
        return { success: false, error };
    }
};

export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'admin@example.com',
            to: email,
            subject: '🔐 Reset Your Blueteeth Dental Store Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7ff; padding: 40px; border-radius: 24px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="display: inline-block; width: 60px; height: 60px; background-color: #0056D2; color: #white; border-radius: 16px; line-height: 60px; font-size: 32px; font-weight: bold; text-align: center;">B</div>
                        <h2 style="color: #0A1F44; margin-top: 20px; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">Password Reset Request</h2>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,86,210,0.05);">
                        <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hello,</p>
                        <p style="font-size: 16px; color: #475569; line-height: 1.6;">
                            We received a request to reset the password for your Blueteeth Dental Store account. Click the button below to set a new password:
                        </p>
                        
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="${resetLink}" style="background-color: #0056D2; color: #ffffff; padding: 16px 32px; border-radius: 14px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(0,86,210,0.2);">
                                Reset My Password
                            </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
                            If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.
                        </p>
                    </div>
                    
                    <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                        Blueteeth Dental Store &copy; 2026
                    </p>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully to:", email);
        return { success: true };
    } catch (error) {
        console.error("Failed to send password reset email:", error);
        return { success: false, error };
    }
};

export const sendSupportNotification = async (ticketData: any, ticketId: string) => {
    try {
        const recipients = [
            'support@blueteeth.store',
            'storeblueteeth@gmail.com'
        ].join(', ');

        const mailOptions = {
            from: process.env.EMAIL_USER || 'admin@example.com',
            to: recipients,
            subject: `🚨 New Support Ticket: ${ticketId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #0056D2; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">New Clinical Support Request</h2>
                    
                    <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <p><strong>Ticket ID:</strong> ${ticketId}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                        <p><strong>Name:</strong> ${ticketData.firstName}</p>
                        <p><strong>Email:</strong> ${ticketData.email}</p>
                    </div>

                    <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h3 style="color: #333; margin-top: 0;">Message Payload</h3>
                        <p style="white-space: pre-wrap; color: #555; background-color: #f1f5f9; padding: 15px; border-radius: 8px;">${ticketData.message}</p>
                    </div>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Support email sent successfully", result.messageId);
        return { success: true };
    } catch (error) {
        console.error("Failed to send support email:", error);
        return { success: false, error };
    }
};
export const sendMembershipUpgradeNotification = async (userData: any, plan: any) => {
    try {
        const recipients = [
            'support@blueteeth.store',
            'storeblueteeth@gmail.com'
        ].join(', ');

        const mailOptions = {
            from: process.env.EMAIL_USER || 'admin@example.com',
            to: recipients,
            subject: `👑 New Membership Upgrade Request: ${plan.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7ff; padding: 40px; border-radius: 24px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #0A1F44; margin-top: 20px; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">Membership Upgrade Request</h2>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,86,210,0.05);">
                        <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hello Admin,</p>
                        <p style="font-size: 16px; color: #475569; line-height: 1.6;">A user has requested an upgrade to their membership plan:</p>
                        
                        <div style="background-color: #f8faff; padding: 20px; border-radius: 16px; margin: 25px 0; border: 1px solid #e2e8f0;">
                            <p style="margin: 5px 0;"><strong>Plan Name:</strong> ${plan.name}</p>
                            <p style="margin: 5px 0;"><strong>Price:</strong> ₹${plan.price.toLocaleString()}</p>
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
                            <p style="margin: 5px 0;"><strong>User Name:</strong> ${userData.name || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>User Email:</strong> ${userData.email || 'N/A'}</p>
                        </div>
                        
                        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
                            Please contact the customer to finalize the billing and activate their tier.
                        </p>
                    </div>
                    
                    <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                        Blueteeth Dental Store &copy; 2026 Admin Portal
                    </p>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Membership upgrade notification sent successfully");
        return { success: true };
    } catch (error) {
        console.error("Failed to send membership upgrade email:", error);
        return { success: false, error };
    }
};

export const sendClinicSetupNotification = async (formData: any, setupDetails: any) => {
    try {
        const recipients = [
            'support@blueteeth.store',
            'storeblueteeth@gmail.com'
        ].join(', ');

        const mailOptions = {
            from: process.env.EMAIL_USER || 'admin@example.com',
            to: recipients,
            subject: `🏥 New Clinic Setup Request: ${formData.clinicName || 'Unnamed Clinic'}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px; border-radius: 24px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #0f172a; margin-top: 20px; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">Clinic Setup Implementation Alert</h2>
                        <p style="color: #64748b; font-size: 14px;">A new doctor has requested a custom clinic setup plan.</p>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                        <h3 style="color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 20px;">Doctor & Clinic Details</h3>
                        <p style="margin: 10px 0;"><strong>Doctor Name:</strong> ${formData.name}</p>
                        <p style="margin: 10px 0;"><strong>Phone Number:</strong> ${formData.phone}</p>
                        <p style="margin: 10px 0;"><strong>Clinic Name:</strong> ${formData.clinicName || 'Not specified'}</p>
                        <p style="margin: 10px 0;"><strong>City/Location:</strong> ${formData.city}</p>
                        <p style="margin: 10px 0; color: #0056D2;"><strong>Preferred Call Time:</strong> ${formData.preferredTime || 'ASAP'}</p>
                        
                        <h3 style="color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; margin: 30px 0 20px;">Configuration Selections</h3>
                        <p style="margin: 10px 0;"><strong>Clinic Type:</strong> ${setupDetails.type}</p>
                        <p style="margin: 10px 0;"><strong>Setup Cost (Est.):</strong> ₹${setupDetails.totalPrice.toLocaleString()}</p>
                        <p style="margin: 10px 0;"><strong>Financing Plan:</strong> ₹${setupDetails.loanAmount.toLocaleString()} over ${setupDetails.tenure} months</p>
                        <p style="margin: 10px 0;"><strong>Monthly EMI (Est.):</strong> ₹${setupDetails.emi.toLocaleString()}</p>
                        
                        <div style="margin-top: 25px; padding: 15px; background-color: #f1f5f9; border-radius: 12px;">
                            <p style="margin: 0; font-size: 13px; color: #475569;"><strong>Equipment Bundle:</strong> ${setupDetails.packages.join(', ') || 'Standard Only'}</p>
                        </div>
                    </div>
                    
                    <p style="text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                        Lead generated via Blueteeth Clinic Wizard &copy; 2026
                    </p>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Clinic setup notification email sent successfully");
        return { success: true };
    } catch (error) {
        console.error("Failed to send clinic setup notification email:", error);
        return { success: false, error };
    }
};
