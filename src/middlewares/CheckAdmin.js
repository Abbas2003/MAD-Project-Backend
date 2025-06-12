

export const VerifyAdmin = (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized access. No user found." });
        }

        // Check if the user is a super admin
        if (user.user_type !== "super admin" || user?.user_type !== "admin") {
            return res.status(403).json({ message: "Forbidden. You do not have Super Admin/Admin access." });
        }

        next();
    } catch (error) {
        console.error("Error verifying super admin:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
}