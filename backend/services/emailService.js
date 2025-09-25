const nodemailer = require('nodemailer');

// Create transporter with SSL certificate handling
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
});

// Email templates
const emailTemplates = {
  claimNotification: (itemTitle, claimerName, claimDescription) => ({
    subject: `New Claim on Your ${itemTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Campus Lost & Found</h2>
        <h3>New Claim on Your Item</h3>
        <p>Someone has claimed your item: <strong>${itemTitle}</strong></p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Claimer:</strong> ${claimerName}</p>
          <p><strong>Description:</strong> ${claimDescription}</p>
        </div>
        <p>Please log in to your account to review this claim.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" 
           style="background-color: #2563eb; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          View Dashboard
        </a>
        <hr style="margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated message from Campus Lost & Found System.
        </p>
      </div>
    `,
  }),

  matchSuggestion: (lostItem, foundItem) => ({
    subject: `Potential Match Found for Your Lost Item`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Campus Lost & Found</h2>
        <h3>Potential Match Found!</h3>
        <p>We found a potential match for your lost item: <strong>${lostItem.title}</strong></p>
        
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h4>Found Item Details:</h4>
          <p><strong>Title:</strong> ${foundItem.title}</p>
          <p><strong>Description:</strong> ${foundItem.description}</p>
          <p><strong>Location Found:</strong> ${foundItem.location}</p>
          <p><strong>Date Found:</strong> ${new Date(foundItem.date).toLocaleDateString()}</p>
        </div>

        <p>If this looks like your item, you can claim it through the system.</p>
        <a href="${process.env.CLIENT_URL}/items/${foundItem._id}" 
           style="background-color: #2563eb; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          View Item Details
        </a>
        <hr style="margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated message from Campus Lost & Found System.
        </p>
      </div>
    `,
  }),

  claimApproved: (itemTitle) => ({
    subject: `Your Claim Has Been Approved`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Campus Lost & Found</h2>
        <h3>Claim Approved!</h3>
        <p>Your claim for <strong>${itemTitle}</strong> has been approved by the owner.</p>
        <p>Please contact the item owner to arrange for pickup.</p>
        
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Contact the item owner to arrange pickup</li>
            <li>Bring your campus ID for verification</li>
            <li>Confirm unique identifying marks of the item</li>
          </ol>
        </div>

        <a href="${process.env.CLIENT_URL}/dashboard" 
           style="background-color: #2563eb; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          View Dashboard
        </a>
        <hr style="margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated message from Campus Lost & Found System.
        </p>
      </div>
    `,
  }),
};

const sendEmail = async (to, templateName, data) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not configured. Skipping email send.');
      return true;
    }

    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template ${templateName} not found`);
    }

    const emailContent = typeof template === 'function' ? template(...data) : template;

    const mailOptions = {
      from: `"Campus Lost & Found" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    console.log('Attempting to send email to:', to);
    
    // Test the transporter connection first
    await transporter.verify();
    console.log('Email server is ready to take our messages');

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}:`, result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    
    // More specific error handling
    if (error.code === 'EAUTH') {
      console.log('Authentication failed. Check email credentials.');
    } else if (error.code === 'ESOCKET') {
      console.log('Network error. Check internet connection.');
    } else {
      console.log('Email sending failed:', error.message);
    }
    
    return false;
  }
};

module.exports = { sendEmail };