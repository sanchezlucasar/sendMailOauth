import { NextResponse, NextRequest } from "next/server";
import prisma from '@/libs/db';

export const DELETE = async (request: Request, context: any) => {
    try {

        const { params } = context;
        const id = params?.clientId;

        const cliente = await prisma.client.delete({
            where: {
                id: Number(id)
            }
        })

        return NextResponse.json(cliente);

    } catch (error) {
        return NextResponse.json({ error: "Error obteniendo los clientes" }, { status: 500 });
    }
}
