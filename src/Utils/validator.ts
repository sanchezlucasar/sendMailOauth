import { validate } from "./SchemaValidator/emailSchema";
import { statusCodes } from "./statusCode/statusCode";
import prisma from "@/libs/db";

export const validateData = (data: any) => {
    const valid = validate(data);
    if (!valid && validate.errors) {
        const missingFields = validate.errors.map((error) => {
            return `Falta el campo '${error.instancePath.slice(1)}'`;
        });
        return {
            valid: false,
            missingFields,
        };
    }
    return { valid: true };
};

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
