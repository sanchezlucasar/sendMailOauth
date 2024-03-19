'use server'

import prisma from '@/libs/db';
import { statusCodes } from '@/Utils/statusCode/statusCode';
import { IEmail, Log } from "@/types";
import { validateApiKey, validateData } from '@/Utils/validator';
import { google } from 'googleapis';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { createLogs } from '../log/actions';

const send = async (from: string, subject: string, to: string, cc: string, text: string, transporter: any) => {
    try {
        await transporter.sendMail({ from, subject, text, to, cc });
        console.log(`Sent to ${to} , ${cc}`);
    } catch (err) {
        return { error: { message: `error al enviar el mensaje to ${to}, ${cc}` } };
    }
};

export const sendNewMail = async (data: IEmail) => {
    try {

        if (!validateData(data)) return { error: 'Datos invalidos' };

        const cliente = await prisma.client.findUnique({ where: { id: data.id } });

        if (!cliente) return { error: 'No se ha encontrado al cliente' };

        if (!cliente.mail) return { error: 'Falta el mail para enviar el correo' };
        const validaApiKey = await validateApiKey(cliente.apiKey, cliente.nombre)

        if (validaApiKey.statusCode !== statusCodes.OK) return { message: 'ApiKey invalida o inexistente.' };

        const accountTransport = {
            'service': 'gmail',
            'auth': {
                'type': 'OAuth2',
                'user': cliente.mail,
                'clientId': cliente.clientId,
                'clientSecret': cliente.clientSecret,
                'refreshToken': cliente.refreshToken
            }
        };

        const oauth2Client = new google.auth.OAuth2(
            accountTransport.auth.clientId,
            accountTransport.auth.clientSecret,
            'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
            refresh_token: accountTransport.auth.refreshToken
        });

        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: accountTransport.auth.user,
                clientId: accountTransport.auth.clientId,
                clientSecret: accountTransport.auth.clientSecret,
                refreshToken: accountTransport.auth.refreshToken,
                accessToken: accessToken,
            },
        } as SendMailOptions);

        // Enviar los correos electrónicos
        const res = await send(accountTransport.auth.user, data.subject, data.to, data.cc, data.text, transporter);
        // se genera el registro de log
        const logMessage = `Email enviado de: ${data.to}, cc: ${data.cc}, asunto:${data.subject}, mensaje: ${data.text}`;
        createLogs({ texto: logMessage })

        return res;
    } catch (error: any) {
        return { error: 'Error al enviar el correo.' };
    }
}
