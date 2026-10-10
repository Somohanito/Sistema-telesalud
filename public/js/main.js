/*
 * Control de sesión del usuario
 */
async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = 'login.html';
}