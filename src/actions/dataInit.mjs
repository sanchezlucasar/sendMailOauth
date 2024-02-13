import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const dataInit = async () => {
    try {
        const hashedPassword = await bcrypt.hash('Password123', 10);
        await prisma.user.create({
            data: {
                email: 'emailprueba@emailprueba.com',
                username: 'AdminTestUser',
                password: hashedPassword,
            },
        });
        console.log('Datos inicializados correctamente.');
    } catch (error) {
        console.error('Error al inicializar datos:', error);
        process.exit(1);
    } finally {
        // Cerrar la conexión de Prisma al finalizar
        await prisma.$disconnect();
    }
}

// Llamar a la función para inicializar los datos
dataInit();
