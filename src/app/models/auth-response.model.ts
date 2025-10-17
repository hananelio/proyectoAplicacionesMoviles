export interface AuthResponse {
    idToken: string; // Un ID de autenticación para el usuario.
    refreshToken: string; // Un token que se puede usar para obtener un nuevo ID de autenticación.
    expiresIn?: string; // La cantidad de tiempo en segundos que el ID de autenticación es válido.
    localId: string; // El ID único del usuario.
    email: string; // El correo electrónico del usuario.
}

