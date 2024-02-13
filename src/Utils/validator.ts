import { validate } from "./SchemaValidator/emailSchema";

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
