import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
    // support `Authorization: Bearer <token>` or legacy `token` header
    const authHeader = req.headers.authorization || req.headers.token
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Not authorized' })
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        if (!req.body) req.body = {}
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.error('authUser error:', error.message || error)
        res.status(401).json({ success: false, message: 'Invalid or expired token' })
    }
}

export default authUser
