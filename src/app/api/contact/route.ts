import { validateData } from '@/Utils/validator';
import { NextResponse } from 'next/server';
import { validateApiKey } from '@/Utils/ValidatorApiKey/validator'
import { google } from 'googleapis';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { IEmail } from '@/types';

const sendEmails = async (from: string, subject: string, to: string, cc: string, text: string, transporter: any) => {
    try {
        await transporter.sendMail({ from, subject, text, to, cc });
        console.log(`Sent to ${to} , ${cc}`);
    } catch (err) {
        console.log(`Sending to ${to}, ${cc} failed: ${err}`);
    }
};

export async function POST(request: Request) {
    try {
        const data: IEmail = await request.json();
        const valid = validateData(data);
        console.log('data', data);

        if (!valid) {
            throw new Error(`Datos inválidos`,);
        }

        if (!data.from) return NextResponse.json({ message: 'Falta el mail paraenviar el correo' });

        if (!data.apiKey || !data.from || !data.clientId || !data.clientSecret || !data.refreshToken) {
            console.error('No se han proporcionado las credenciales adecuadas para enviar el correo electrónico.');
            return NextResponse.json({ message: 'No se han proporcionado las credenciales adecuadas para enviar el correo electrónico.' });
        }

        const valida = await validateApiKey(data.apiKey, data.nombre_cliente)

        if (valida.statusCode !== 200) return NextResponse.json({ message: 'ApiKey invalida o inexistente' });

        const accountTransport = {
            "service": "gmail",
            "auth": {
                "type": "OAuth2",
                "user": data.from,
                "clientId": data.clientId,
                "clientSecret": data.clientSecret,
                "refreshToken": data.refreshToken
            }
        };

        const oauth2Client = new google.auth.OAuth2(
            accountTransport.auth.clientId,
            accountTransport.auth.clientSecret,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: accountTransport.auth.refreshToken
        });

        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: accountTransport.auth.user,
                clientId: accountTransport.auth.clientId,
                clientSecret: accountTransport.auth.clientSecret,
                refreshToken: accountTransport.auth.refreshToken,
                accessToken: accessToken,
            },
        } as SendMailOptions);
        // Enviar los correos electrónicos

        await sendEmails(accountTransport.auth.user, data.subject, data.to, data.cc, data.text, transporter);
        console.log(`Correo electrónico enviado: to: ${data.to} , cc: ${data.cc}`);

        return NextResponse.json({ message: 'Correo electrónico enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        return NextResponse.json({ message: 'Error al enviar el correo electrónico' });
    }
}
