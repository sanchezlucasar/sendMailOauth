export interface IEmail {
    id: number;
    to: string;
    cc: string;
    subject: string;
    text: string;
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
    id: number;
    username: string;
    email: string;
    password: string;
}

export interface Log {

    id: number;
    texto: string;
    createdAt: Date;
}

export interface ToastProps {
    message: string;
    type: 'error' | 'success';
    onClose: () => void;
}
