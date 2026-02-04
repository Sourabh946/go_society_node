module.exports = (...roles) => (req, res, next) => {
    const roleName = req.user?.Role?.name;

    if (!roleName) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(roleName)) {
        return res.status(403).json({ message: "Access denied" });
    }

    next();
};
