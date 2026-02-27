import admin from "firebase-admin";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            console.log("Verifying token...");
            // Verify Firebase Token
            const decodedToken = await admin.auth().verifyIdToken(token);
            console.log("Token verified for UID:", decodedToken.uid);

            // Set user info from decoded token
            req.user = decodedToken;
            req.adminId = decodedToken.uid; // For compatibility with older code if any

            next();
        } catch (error) {
            console.error("Firebase Auth Error:", error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
