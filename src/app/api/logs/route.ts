import { NextResponse } from "next/server";
import prisma from '@/libs/db';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!data) {
            return new NextResponse(
                JSON.stringify({ message: "No se encuentra la información para agregar un log" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const log = await prisma.log.create({
            data: {
                texto: data.texto,
            },
        });

        console.log('Registro log creado correctamente');

        return new NextResponse(
            JSON.stringify(log),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
