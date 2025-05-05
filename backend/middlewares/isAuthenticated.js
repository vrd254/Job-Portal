import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication token missing. Please login to continue.",
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                message: "Invalid token. Please login again.",
                success: false,
            });
        }

        req.id = decoded.userId;

        next();

    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(401).json({
            message: "Unauthorized access. Invalid or expired token.",
            success: false,
        });
    }
};

export default isAuthenticated;
