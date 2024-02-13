import crypto from 'crypto'

const generateAPIKey = () => {
    return new Promise((resolve, reject) => {
        // Longitud de la clave en bytes
        const longitudClave = 32; // Puedes ajustar la longitud según tus necesidades de seguridad

        // Genera bytes aleatorios
        crypto.randomBytes(longitudClave, (err, buffer) => {
            if (err) {
                reject(err);
                return;
            }

            // Convierte los bytes en una cadena hexadecimal
            const apiKey = buffer.toString('hex');
            resolve(apiKey);
        });
    });
};

export default generateAPIKey;
