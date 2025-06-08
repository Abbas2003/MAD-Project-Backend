import baseUser from '../../models/NewUser.model.js';

export const verifyEmail = async (req, res) => {
    try {
        const { email, token } = req.body;

        const user = await baseUser.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.verificationToken !== token || user.verificationTokenExpires < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Something went wrong during verification' });
    }
};