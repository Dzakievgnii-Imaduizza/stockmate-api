/**
 * Triggers an n8n webhook to send an email with a reset code.
 * 
 * @param {string} email - The user's email address.
 * @param {string} code - The 6-digit reset code (or any string code).
 * @returns {Promise<boolean>} - Returns true if successful, throws an error if it fails.
 */
const sendResetCodeEmail = async (email, code) => {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_OTP;

  if (!n8nWebhookUrl) {
    throw new Error('N8N_WEBHOOK_URL is not defined in environment variables');
  }

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        code: code
      })
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status: ${response.status}`);
    }

    // Optional: Parse the response if your n8n workflow returns data
    // const data = await response.json();
    
    return true;

  } catch (error) {
    console.error('Failed to trigger n8n webhook:', error);
    throw new Error('Failed to send the email via n8n. Please try again later.');
  }
};

module.exports = {
  sendResetCodeEmail
};