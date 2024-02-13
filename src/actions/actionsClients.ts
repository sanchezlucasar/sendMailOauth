// actions.ts

'use server';

import { NextResponse } from "next/server";
import prisma from '@/libs/db';


export const deleteClient = async (id: number) => {
    try {

        const userFound = await prisma.client.findUnique({
            where: {
                id: id,
            },
        });
        if (!userFound) {
            return NextResponse.json({ message: "El cliente no existe" }, { status: 400 });
        }

        const client = await prisma.client.delete({
            where: {
                id: id,
            }
        });
        return client;
    } catch (error) {
        return NextResponse.json({ message: "Error eliminando el cliente" }, { status: 500 });
    }
};
