'use client'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const Contact = () => {
    const { handleSubmit, register } = useForm();
    const [clients, setClients] = useState([] as any);
    const [selectedApiKey, setSelectedApiKey] = useState<string>("");
    const [selectedClientEmail, setSelectedClientEmail] = useState<string>("");
    const [selectedNombre, setSelectedNombreCliente] = useState<string>("");
    const [selectedClientId, setSelectedClientId] = useState<string>("");
    const [selectedClientSecret, setSelectedClientSecret] = useState<string>("");
    const [selectedRefreshToken, setSelectedRefreshToken] = useState<string>("");

    const [alerta, setAlert] = useState(false)

    const router = useRouter();

    const onSubmit = handleSubmit(async (data: any) => {
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: selectedClientEmail,
                    clientId: selectedClientId,
                    clientSecret: selectedClientSecret,
                    refreshToken: selectedRefreshToken,
                    to: data.to,
                    cc: data.cc,
                    text: data.mensaje,
                    subject: data.asunto,
                    apiKey: selectedApiKey ? selectedApiKey : data.cliente, // Si hay selectedApiKey, usa eso; de lo contrario, usa data.cliente
                    nombre_cliente: selectedNombre ? selectedNombre : data.nombre
                }),
            });

            if (res.ok) {
                setAlert(true);

                const logMessage = `Email enviado de: ${data.to}, cc: ${data.cc}, asunto:${data.subject}, mensaje: ${data.text}`;
                const resLog = await fetch('/api/logs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ texto: logMessage }),
                });
                if (resLog.ok) {
                    console.log("registro guardado correctamente");
                }
                setTimeout(() => {
                    setAlert(false);
                    router.push('/contact'); // Esto quitará el mensaje de alerta después de 2 segundos
                }, 1000);
            } else {
                const resJSON = await res.json();
                throw new Error(resJSON.message);
            }
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            alert("Error al enviar el mensaje");
        }

    });

    const fetchClientsData = async () => {
        try {
            const response: any = await fetch('/api/client');
            const clientJson = await response.json();
            setClients(clientJson);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    useEffect(() => {
        fetchClientsData();
    }, []);

    const handleClientSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedClient = clients.find((client: any) => client.nombre === event.target.value);
        if (selectedClient) {
            console.log('cliente elejido', selectedClient);
            setSelectedNombreCliente(selectedClient.nombre)
            setSelectedApiKey(selectedClient.apiKey);
            setSelectedClientEmail(selectedClient.mail);
            setSelectedClientId(selectedClient.clientId)
            setSelectedClientSecret(selectedClient.clientSecret)
            setSelectedRefreshToken(selectedClient.refreshToken)

        } else {
            setSelectedApiKey(""); // Si no se encuentra la apiKey, se establece como vacía
            setSelectedClientEmail("");
        }
    };

    return (
        <div>
            <Navbar />

            <div className="w-4/5 mx-auto h-screen ">
                {alerta && (
                    <div role="alert" className="alert alert-success">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>Mensaje enviado correctamente</span>
                    </div>
                )
                }
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
                                {clients && clients.map((cliente: any) => (
                                    <option key={cliente.id} value={cliente.nombre}>
                                        {cliente.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className="w-6/12 ml-2">

                            <label htmlFor="from" className="text-slate-500 mb-2 block text-sm">
                                De</label>
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

                            <label htmlFor="to" className="text-slate-500 mb-2 block text-sm">
                                Email (separados por comas) </label>
                            <input type="text"
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
