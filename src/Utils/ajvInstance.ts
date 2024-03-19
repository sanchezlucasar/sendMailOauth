import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: false, messages: false }); // options can be passed, e.g.

ajv.addFormat('apiKey', /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g);
ajv.addFormat('url', /^(http|https):\/\/[^ ']+$/);

ajv.addFormat('email', /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
ajv.addFormat('stringsEmail', /^([\\w+-.%]+@[\\w.-]+\\.[A-Za-z]{2,4}(?:,\\s*\\w+[-.\\w %]+@\\w+\\.\\w+\\.\\w+(?:,|$))*)$/);

ajv.addFormat('date', {
    type: 'string',
    validate: (data) => {
        return new Date(data).toString() !== 'Invalid Date';
    },
});

ajv.addKeyword({
    keyword: 'isNotEmpty',
    validate: (schema: any, data: any) => {
        if (schema) {
            return typeof data === 'string' && data.trim() !== '';
        }
        return true;
    }
});

export { ajv as ajvInstance };
