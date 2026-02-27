import admin from "firebase-admin";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.adminId = decodedToken.uid;
    next();

  } catch (err) {
    console.error("Firebase Auth Error (Secondary):", err);
    res.status(401).json({
      message: "Invalid token",
    });
  }
};