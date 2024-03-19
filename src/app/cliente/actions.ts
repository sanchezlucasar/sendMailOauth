'use server'

import prisma from '@/libs/db';
import generateAPIKey from '@/Utils/Crypto/Encrypt'
import { Client } from "@/types";

export const createClients = async (data: any) => {
    try {

        if (!data) return { error: 'No se encuentra la información para dar de alta al cliente' };

        const userFound = await prisma.client.findUnique({ where: { nombre: data.nombre } });

        if (userFound) return { error: 'Ya se encuentra creado un cliente con ese nombre' };

        const apiKey = await generateAPIKey();

        const client: Client = await prisma.client.create({
            data: {
                nombre: data.nombre,
                mail: data.mail as string,
                clientId: data.clientId as string,
                clientSecret: data.clientSecret as string,
                refreshToken: data.refreshToken as string,
                apiKey: apiKey as string,
            }
        });

        return client;

    } catch (error: any) {
        return { error: error.message };
    }
};


export const fetchClients = async (searchTerm: string) => {
    try {

        const clientes: Client[] = await prisma.client.findMany({
            where: {
                nombre: {
                    contains: searchTerm
                }
            }
        });
        return clientes;
    } catch (error) {
        return [];
    }
}

export const getClientsById = async (data: any) => {
    try {
        if (!data?.clientId) return { error: 'Falta el id.' };
        const cliente = await prisma.client.findUnique({ where: { id: data.clientId } });

        if (!cliente) return { error: `No se encontró un cliente con el id ${data.id}.` };

        return cliente;

    } catch (error: any) {
        return { error: 'Error buscando el cliente.' };
    }
};

export const deleteClient = async (id: number) => {
    try {

        if (!id) return { error: 'Falta el id.' };

        const cliente = await prisma.client.delete({ where: { id: Number(id) } });
        return cliente;

    } catch (error: any) {
        return { error: 'Error eliminando el cliente.' };
    }
};

export const updateClient = async (data: Client) => {
    try {

        const userFound = await prisma.client.findUnique({ where: { id: data.id } });

        if (!userFound) return { error: 'El cliente no existe.' };

        const client: Client = await prisma.client.update({
            where: {
                id: data.id,
            },
            data: {
                nombre: data.nombre,
                mail: data.mail,
                clientId: data.clientId,
                clientSecret: data.clientSecret,
                refreshToken: data.refreshToken,
            },
        });

        return client;

    } catch (error: any) {
        return { error: 'Error modificando el cliente.' };
    }
};
