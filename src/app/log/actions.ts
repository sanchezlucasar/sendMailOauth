'use server'

import prisma from '@/libs/db';
import { Log } from "@/types";

export const createLogs = async (data: any) => {
    try {

        if (!data) return { error: `No se encuentra la información para agregar un log.` };

        const log: Log = await prisma.log.create({ data: { texto: data.texto } });

        return log;
    } catch (error: any) {
        return { error: 'Error creando el log.' };
    }
}

export const fetchLogs = async () => {

    try {
        const res = await prisma.log.findMany();
        return res;
    } catch (error: any) {
        return { error: 'Error obteniendo los.' };
    }
};
