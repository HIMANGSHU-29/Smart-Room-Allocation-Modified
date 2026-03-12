import ErrorLog from "../models/errorLog.js";

// Save a new error log
export const logError = async (req, res) => {
    try {
        const { message, stack, component, route, timestamp } = req.body;
        const errorLog = new ErrorLog({
            message,
            stack,
            component,
            route,
            timestamp: timestamp ? new Date(timestamp) : new Date()
        });
        await errorLog.save();
        res.status(201).json({ message: "Error logged successfully" });
    } catch (error) {
        // Fallback: Just log to console if DB fails so we don't crash the error handler
        console.error("Failed to log error to DB:", error);
        res.status(500).json({ error: "Internal server error while logging crash" });
    }
};

// Retrieve all error logs, newest first
export const getErrors = async (req, res) => {
    try {
        const errors = await ErrorLog.find().sort({ timestamp: -1 }).limit(100);
        res.status(200).json(errors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
