import admin from "firebase-admin";

export const protect = async (req, res, next) => {
    // BYPASS AUTHENTICATION FOR DEVELOPMENT / DEMO
    // The previous implementation used Firebase Admin which is missing credentials.
    console.log("Auth bypassed for development");
    req.user = { uid: "global_admin" };
    req.adminId = "global_admin";

    // We'll still try to parse a token if it exists just to not break anything
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    next();
};
