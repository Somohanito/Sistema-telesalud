/*
 * Verificación de sesión activa
 */
function verificarSesion(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({ error: "No autorizado." });
    }
    next();
}

/*
 * Control de acceso por roles de usuario
 */
function permitirRoles(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.session.usuario || !rolesPermitidos.includes(req.session.usuario.rol)) {
            return res.status(403).json({ error: "Acceso denegado." });
        }
        next();
    };
}

module.exports = { verificarSesion, permitirRoles };