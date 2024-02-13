import { ajvInstance } from "../ajvInstance";

const schema = {
    type: 'object',
    properties: {
        from: { type: 'string', isNotEmpty: false, minLength: 1 },
        to: { type: 'string', format: 'stringsEmail', isNotEmpty: false, minLength: 1 },
        cc: { type: 'string', format: 'stringsEmail', isNotEmpty: false, minLength: 1 },
        subject: { type: 'string', isNotEmpty: false, minLength: 1 },
        text: { type: 'string', isNotEmpty: false, minLength: 1 },
        apiKey: { type: 'string', isNotEmpty: false, minLength: 1 },
    },
    required: ['from', 'to', 'text'],
    additionalProperties: false
};

export const validate = ajvInstance.compile(schema);

