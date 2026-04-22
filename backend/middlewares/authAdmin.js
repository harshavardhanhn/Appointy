import jwt from "jsonwebtoken"

// admin authentication middleware: expects `Authorization: Bearer <token>`
const authAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.atoken
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded || decoded.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }

        next()
    } catch (error) {
        console.error('authAdmin error:', error.message || error)
        res.status(401).json({ success: false, message: 'Invalid or expired token' })
    }
}

export default authAdmin;