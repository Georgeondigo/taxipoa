const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

async function authMiddleware(req, res, next) {
    try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
             success: false,
             message: 'No token provided Please log in'
        });
    }
    
    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Get user from database
    const user = await prisma.user.findUnique({
        where: {id: decoded.userId},
        select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            plan: true,
            preferredLanguage: true,
        }
    });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User not found.'
        });
    }

    // Attach user to request object
    req.user = user;
    next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Your session has expired. Please log in again.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Please log in again.'
        });
    }
}

module.exports = authMiddleware;