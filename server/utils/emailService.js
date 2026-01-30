const nodemailer = require('nodemailer');

const sendOrderEmail = async (order, user) => {
    // 1. Create Transporter
    // For now using Gmail. Requires user to set SMTP_EMAIL and SMTP_PASSWORD in env.
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.log("⚠️ SMTP Credentials missing. Skipping email send.");
        return;
    }

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL;

    // 2. Email Content for User
    const userMailOptions = {
        from: `"Hayatt Gear" <${process.env.SMTP_EMAIL}>`,
        to: user.email,
        subject: `Mission Confirmed: Order #${order._id}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #2563eb;">Mission Authorized! 🚀</h1>
                <p>Agent <strong>${user.name}</strong>,</p>
                <p>Your gear requisition has been confirmed. Below are your mission details:</p>
                <hr />
                <h3>Order ID: ${order._id}</h3>
                <p>Total Amount: <strong>$${order.totalPrice}</strong></p>
                <p>Status: <strong>${order.status}</strong></p>
                <hr />
                <p>Track your shipment in the dashboard.</p>
                <p><em>Hayatt Command</em></p>
            </div>
        `
    };

    // 3. Email Content for Admin
    const adminMailOptions = {
        from: `"Hayatt System" <${process.env.SMTP_EMAIL}>`,
        to: adminEmail,
        subject: `New Order Received: #${order._id}`,
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>New Order Alert 🚨</h2>
                <p><strong>User:</strong> ${user.name} (${user.email})</p>
                <p><strong>Amount:</strong> $${order.totalPrice}</p>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p>Please log in to the admin panel to process this order.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(userMailOptions);
        console.log(`📧 User email sent to ${user.email}`);

        await transporter.sendMail(adminMailOptions);
        console.log(`📧 Admin email sent to ${adminEmail}`);
    } catch (error) {
        console.error("❌ Email Send Error:", error);
    }
};

const sendStatusUpdateEmail = async (order, user) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) return;

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL;

    // Email to User
    const userMailOptions = {
        from: `"Hayatt Gear" <${process.env.SMTP_EMAIL}>`,
        to: user.email,
        subject: `Mission Update: Order #${order._id} is ${order.status}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #2563eb;">Status Update: ${order.status} 🚀</h1>
                <p>Agent <strong>${user.name}</strong>,</p>
                <p>Your requisition status has been updated.</p>
                <hr />
                <h3>Order ID: ${order._id}</h3>
                <p>New Status: <strong style="color: ${order.status === 'Shipped' ? '#9333ea' : '#16a34a'};">${order.status}</strong></p>
                <hr />
                <p>Track your shipment in the dashboard.</p>
                <p><em>Hayatt Command</em></p>
            </div>
        `
    };

    // Email to Admin
    const adminMailOptions = {
        from: `"Hayatt System" <${process.env.SMTP_EMAIL}>`,
        to: adminEmail,
        subject: `Status Changed: Order #${order._id} -> ${order.status}`,
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Order Status Updated 🔄</h2>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>New Status:</strong> ${order.status}</p>
                <p><strong>User:</strong> ${user.name} (${user.email})</p>
                <p>Notification sent to user.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(userMailOptions);
        console.log(`📧 Status update email sent to ${user.email}`);

        await transporter.sendMail(adminMailOptions);
        console.log(`📧 Admin status notification sent to ${adminEmail}`);
    } catch (error) {
        console.error("❌ Email Send Error:", error);
    }
};

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: `"Hayatt Store" <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || `<div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #2563eb;">${options.subject}</h2>
            <p style="font-size: 16px;">${options.message}</p>
            <hr />
            <p><em>Hayatt Security System</em></p>
        </div>`
    };

    await transporter.sendMail(mailOptions);
};

const sendCancellationEmail = async (order, user) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) return;

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL;

    // Email to User
    const userMailOptions = {
        from: `"Hayatt Gear" <${process.env.SMTP_EMAIL}>`,
        to: user.email,
        subject: `Order Cancelled: Order #${order._id}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #ef4444;">Order Cancelled 🛑</h1>
                <p>Agent <strong>${user.name}</strong>,</p>
                <p>Your order #${order._id} has been successfully cancelled as per your request.</p>
                <hr />
                <p><strong>Reason:</strong> ${order.cancellationReason}</p>
                <p>If you have been charged, a refund will be processed shortly.</p>
                <hr />
                <p><em>Hayatt Command</em></p>
            </div>
        `
    };

    // Email to Admin
    const adminMailOptions = {
        from: `"Hayatt System" <${process.env.SMTP_EMAIL}>`,
        to: adminEmail,
        subject: `Order Cancelled by User: #${order._id}`,
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Order Cancellation Alert ⚠️</h2>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>User:</strong> ${user.name} (${user.email})</p>
                <p><strong>Reason:</strong> ${order.cancellationReason}</p>
                <p>Please review and process any necessary refunds.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(userMailOptions);
        console.log(`📧 Cancellation email sent to ${user.email}`);

        await transporter.sendMail(adminMailOptions);
        console.log(`📧 Admin cancellation notification sent to ${adminEmail}`);
    } catch (error) {
        console.error("❌ Email Send Error:", error);
    }
};

module.exports = { sendOrderEmail, sendStatusUpdateEmail, sendEmail, sendCancellationEmail };
