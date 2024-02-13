
import { NextResponse, NextRequest } from "next/server";
import prisma from '@/libs/db';
import generateAPIKey from "@/Utils/Crypto/Encrypt";
import { Client, IEmail } from "@/types";


export async function POST(request: Request, context: any) {
    try {
        const data: Client = await request.json();

        if (!data) {
            return new NextResponse(
                JSON.stringify({ message: "No se encuentra la informacion para dar de alta al cliente" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const userFound = await prisma.client.findUnique({
            where: {
                nombre: data.nombre,
            },
        });

        if (userFound) {
            return new NextResponse(
                JSON.stringify({ message: "Ya se encuentra creado un cliente con ese nombre" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const apiKey = await generateAPIKey();


        const client = await prisma.client.create({
            data: {
                nombre: data.nombre,
                mail: data.mail as string,
                clientId: data.clientId as string,
                clientSecret: data.clientSecret as string,
                refreshToken: data.refreshToken as string,
                apiKey: apiKey as string,
            }
        }
        );
        console.log('cliente creado correctamente');

        return new NextResponse(JSON.stringify(client), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export const GET = async () => {
    try {
        const res: any[] = await prisma.client.findMany();
        return new NextResponse(JSON.stringify(res), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: "Error obteniendo los clientes" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};

export const PUT = async (request: Request) => {
    try {
        const data: Client = await request.json();
        const userFound = await prisma.client.findUnique({
            where: {
                id: data.id,
            },
        });

        if (!userFound) {
            return new NextResponse(JSON.stringify({ message: "El cliente no existe" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const { nombre, mail, clientId, clientSecret, refreshToken } = data;

        const client = await prisma.client.update({
            where: {
                id: data.id,
            },
            data: {
                nombre: nombre,
                mail: mail,
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
            },
        });

        return new NextResponse(JSON.stringify(client), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: "Error obteniendo los clientes" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
