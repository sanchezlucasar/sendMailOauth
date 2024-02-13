export interface IEmail {
    nombre_cliente: string
    from: string;
    to: string;
    cc: string;
    subject: string;
    text: string;
    apiKey: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}

export interface Client {
    id: number;
    nombre: string;
    mail: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    apiKey: string
}
export interface Credentials {
    email: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}
