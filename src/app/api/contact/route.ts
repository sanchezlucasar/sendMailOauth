import prisma from '@/libs/db';
import { validateData, validateApiKey } from '@/Utils/validator';
import { NextResponse } from 'next/server';



import { google } from 'googleapis';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { statusCodes } from '@/Utils/statusCode/statusCode';
import { IEmail } from '@/types';
import { createLogs } from '@/app/log/actions';

const sendEmails = async (from: string, subject: string, to: string, cc: string, text: string, transporter: any) => {

    try {
        await transporter.sendMail({ from, subject, text, to, cc });
        console.log(`Sent to ${to} , ${cc}`);
    } catch (err) {
        return NextResponse.json({ error: `error al enviar el mensaje to ${to}, ${cc}` }, { status: statusCodes.INTERNAL_SERVER });

    }
};

export async function POST(request: Request) {
    try {
        const data: IEmail = await request.json();

        if (!validateData(data)) return NextResponse.json({ error: 'Datos inválidos' }, { status: statusCodes.BAD_REQUEST });

        const cliente = await prisma.client.findUnique({ where: { id: data.id } });

        if (!cliente) return NextResponse.json({ error: 'El cliente no existe' }, { status: statusCodes.BAD_REQUEST });

        if (!cliente.mail) return NextResponse.json({ error: 'Falta el mail para enviar el correo' }, { status: statusCodes.BAD_REQUEST });

        if (!cliente.apiKey || !cliente.clientId || !cliente.clientSecret || !cliente.refreshToken)
            NextResponse.json({ error: 'No se han proporcionado las credenciales adecuadas para enviar el correo electrónico.' }, { status: statusCodes.UNAUTHORIZED });
        if (!cliente) return { error: 'No se ha encontrado al cliente' };


        const validaApiKey = await validateApiKey(cliente.apiKey, cliente.nombre)

        if (validaApiKey.statusCode !== statusCodes.OK) return NextResponse.json({ error: 'ApiKey invalida o inexistente' }, { status: statusCodes.UNAUTHORIZED });


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
        await sendEmails(accountTransport.auth.user, data.subject, data.to, data.cc, data.text, transporter);

        // se genera el registro de log
        const logMessage = `Email enviado de: ${data.to}, cc: ${data.cc}, asunto:${data.subject}, mensaje: ${data.text}`;
        createLogs({ texto: logMessage })

        return NextResponse.json({ message: 'Correo electrónico enviado con éxito' });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: statusCodes.INTERNAL_SERVER });

    }
}
