const sendOrderEmail = async (order, user) => {
    console.log("🚫 Email sending disabled: sendOrderEmail called");
    return;
};

const sendStatusUpdateEmail = async (order, user) => {
    console.log("🚫 Email sending disabled: sendStatusUpdateEmail called");
    return;
};

const sendEmail = async (options) => {
    console.log("🚫 Email sending disabled: sendEmail called");
    return;
};

const sendCancellationEmail = async (order, user) => {
    console.log("🚫 Email sending disabled: sendCancellationEmail called");
    return;
};

module.exports = { sendOrderEmail, sendStatusUpdateEmail, sendEmail, sendCancellationEmail };
