const express = require('express');
const router = express.Router();
const { sendPasswordResetEmail } = require('./emailService'); // Function to send email


router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const saveResetToken = async (email, resetToken) => {
        // Assuming you're using a database library like Knex.js
        await knex('password_resets').insert({ email, token: resetToken, created_at: new Date() });
      };
      
    // Generate a unique token for password reset
    const resetToken = generateResetToken();

    // Save the reset token in your database
    await saveResetToken(email, resetToken);

    // Send password reset email with the token
    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'Password reset instructions sent to your email address.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to initiate password recovery.' });
  }
});

router.post('/reset-password', async (req, res) => {
    try {
      const { email, token, newPassword } = req.body;
  
      // Validate the reset token
      const isValidToken = await validateResetToken(email, token);
  
      if (!isValidToken) {
        return res.status(400).json({ error: 'Invalid or expired reset token.' });
      }
  
      // Reset the user's password
      await resetPassword(email, newPassword);
  
      res.json({ message: 'Password reset successful.' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password.' });
    }

module.exports = router;