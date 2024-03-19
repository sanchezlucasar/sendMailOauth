'use client'

import { useState } from "react";
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClients } from "../cliente/actions";
import { sendNewMail } from "./actions";
import { toast } from "react-toastify";
import { Client, IEmail } from "@/types";
import { useDebounce } from "@/Hooks/useDebounce";

const Contact = () => {
    const { handleSubmit, register } = useForm();
    const [selectedClientEmail, setSelectedClientEmail] = useState<string>("");
    const [selectedId, setSelectedId] = useState<string>("");
    const [searchValue, setSearchValue] = useState('');

    const debouncedSearchTerm = useDebounce(searchValue, 0);
    const router = useRouter();
    const queryClient = useQueryClient();

    const sendMailMutation = useMutation({
        mutationFn: (data: IEmail) => sendNewMail(data),
        onSuccess: () => {
            toast.success('Email enviado correctamente');
            queryClient.invalidateQueries();
        }
    });

    const { isLoading, data: clientes, isError, error } = useQuery({
        queryKey: ['clients', debouncedSearchTerm],
        queryFn: () => fetchClients(debouncedSearchTerm)
    });

    if (!clientes) console.log('No existen clientes cargados ');

    const onSubmit = handleSubmit(async (data: any) => {
        try {
            const dataMail: IEmail = {
                id: Number(selectedId),
                to: data.to,
                cc: data.cc,
                text: data.mensaje,
                subject: data.asunto,
            }
            sendMailMutation.mutate(dataMail);
        } catch (error: any) {
            console.log(error);
        }
    });

    const handleClientSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (Array.isArray(clientes)) {
            const selectedClient = clientes.find(
                (client: Client) => client.nombre === event.target.value
            );

            if (selectedClient) {
                setSelectedId(selectedClient.id.toString());
                setSelectedClientEmail(selectedClient.mail);
            } else {
                setSelectedClientEmail("");
            }
        } else {

            console.error("Error selecccionando el cliente.");
        }
    };

    if (isLoading) return <div>...is Loading</div>;

    else if (isError) return <div>Error. {error.message}</div>;

    return (
        <div>

            <div className="main-content w-4/5 mx-auto h-screen ">

                <h2 className="text-2xl ml-0 font-bold flex justify-between w-3/4">
                    <span className=" mt-8">Enviar mail </span>
                </h2>

                <form
                    onSubmit={onSubmit}
                    className="my-10"
                >
                    <div className="flex justify-between">
                        <div className="w-6/12 mr-2">

                            <label htmlFor="cliente" className="text-slate-500 mb-2 block text-sm">
                                Cliente</label>
                            <select
                                {...register('cliente')}
                                required
                                onChange={handleClientSelect} // Manejar el cambio en la selección del cliente
                                className="p-3 text-slate-600 rounded block mb-2 bg-slate-100 text-slate-300 w-full"
                            >
                                <option value="">Selecciona un cliente</option>
                                {(clientes !== undefined) && clientes && Array.isArray(clientes) && clientes.map((cliente: any) => (
                                    <option key={cliente.id} value={cliente.nombre}>
                                        {cliente.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-6/12 ml-2">
                            <label htmlFor="from" className="text-slate-500 mb-2 block text-sm"> De </label>
                            <input
                                type="text"
                                {...register("from")}
                                required
                                disabled
                                defaultValue={selectedClientEmail} // Muestra el correo del cliente seleccionado como valor inicial
                                // Campo deshabilitado para evitar edición
                                className="p-3 text-slate-600 rounded block mb-2 bg-slate-100 text-slate-300 w-full"
                                placeholder="Ejemplo: correo1@example.com"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="w-6/12 mr-2">
                            <label htmlFor="to" className="text-slate-500 mb-2 block text-sm"> Email (separados por comas) </label>
                            <input type="mail"
                                {...register("to")}
                                required
                                className="p-3 text-slate-600 rounded block mb-2 bg-slate-100 text-slate-300 w-full"
                                placeholder="Ejemplo: correo1@example.com,correo2@example.com"

                            />
                        </div>
                        <div className="w-6/12 ml-2">
                            <label htmlFor="cc" className="text-slate-500 mb-2 block text-sm">
                                CC (separados por comas )</label>
                            <input type="text"
                                {...register("cc")}

                                className="p-3 text-slate-600 rounded block mb-2 bg-slate-100 text-slate-300 w-full"
                                placeholder="Ejemplo: correo1@example.com,correo2@example.com"

                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="asunto" className="text-slate-500 mb-2 block text-sm">
                            Asunto </label>
                        <input type="text"
                            {...register("asunto")}
                            required
                            className="p-3 text-slate-600 rounded block mb-2 bg-slate-100 text-slate-300 w-full"
                            placeholder="Ejemplo: Servicio Nuevo"
                        />
                    </div>
                    <div>
                        <label htmlFor="mensaje" className="text-slate-500  mb-2 block text-sm">Mensaje</label>
                        <input
                            type="text"
                            required
                            {...register("mensaje")}
                            className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "
                        />
                    </div>

                    <button className="w-1/3 btn text-slate-200  bg-stone-300 hover:bg-stone-700 p-3 rounded-lg mb-10 mt-7  float-right"
                    > Enviar </button>

                </form >
            </div>

        </div >
    )
}

export default Contact
