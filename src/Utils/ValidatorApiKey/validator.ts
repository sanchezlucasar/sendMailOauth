import prisma from "@/libs/db";
import { statusCodes } from "../statusCode/statusCode";

export const validateApiKey = async (apiKey: string, nombre: string) => {
    try {

        if (!apiKey) return { msg: 'La api key es requerida para realizar la consulta', statusCode: statusCodes.UNAUTHORIZED };
        const cliente = await prisma.client.findUnique({
            where: {
                apiKey: apiKey,
                nombre: nombre
            }
        });
        if (cliente !== null) {
            return { statusCode: statusCodes.OK };
        } return { msg: 'api key inválida', statusCode: statusCodes.BAD_REQUEST };

    }
    catch (error) {
        console.log(error);
        return { msg: 'Error ejecutando la llamada a la api.', statusCode: statusCodes.INTERNAL_SERVER };
    };
};
