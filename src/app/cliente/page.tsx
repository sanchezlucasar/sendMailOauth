'use client'

import { useForm } from "react-hook-form"
import { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { TrashIcon, PencilIcon } from '@heroicons/react/outline';
import Navbar from "@/components/Navbar";
import { Client } from "@/types";
import '@/app/globals.css'
const ClientPage: NextPage = () => {

  const [clients, setClients] = useState([] as any);
  const { register, handleSubmit } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 4;

  const fetchClientsData = async () => {
    try {

      const response = await fetch('/api/client');
      const resJSON = await response.json();
      const clientsData = resJSON // Llama a la función que obtiene los clientes del servidor

      setClients(clientsData); // Actualiza el estado con los clientes obtenidos
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    // Carga inicial de clientes si existen
    fetchClientsData();
  }, []);

  const handleAddClient = () => {
    setShowModalCliente(true);
    setSelectedClient(null);
  };


  const onSubmit = handleSubmit(async (data: any) => {
    try {
      const response = await fetch('/api/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resJSON = await response.json();

      if (response.ok) {
        setShowModalCliente(false);
        setClients([...clients, resJSON]);
      } else {
        if ('message' in resJSON) {
          alert(resJSON.message);
        }
        throw new Error('Error al crear el cliente');
      }

    } catch (error) {
      console.error('Error:', error);
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Client
  ) => {
    if (selectedClient) {
      setSelectedClient({
        ...selectedClient,
        [field]: e.target.value,
      });
    }
  };

  const handleModify = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedClient(null);
    setShowModalCliente(false);
  };

  const handleSaveChanges = async () => {
    try {
      if (selectedClient && clients.length > 0 && clients) {
        const response = await fetch('/api/client', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedClient),
        });

        const updatedClient = await response.json(); // Almacenar el resultado de la respuesta una vez
        console.log(updatedClient);

        if (response.ok) {
          // Actualiza el estado con el cliente actualizado
          const updatedClients = clients.map((existingClient: Client) =>
            existingClient.id === updatedClient.id ? updatedClient : existingClient
          );

          setClients(updatedClients);
          console.log('Cerrando el modal...');
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (id) {
        const response = await fetch(`/api/client/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          alert('cliente eliminado')
          setClients([...clients]);
          fetchClientsData();
          setShowModal(false);
        }

      }
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  };

  const getPaginatedClients = (currentPage: number, itemsPerPage: number, clients: Client[]) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return clients.slice(indexOfFirstItem, indexOfLastItem);
  };

  const paginatedClients = useMemo(() => {
    return getPaginatedClients(currentPage, itemsPerPage, clients);
  }, [clients, currentPage]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredClients = useMemo(() => {
    if (!searchTerm) {
      return paginatedClients;
    }

    return paginatedClients.filter((client) =>
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, paginatedClients]);

  return (
    <div className="h-screen main-content">
      <Navbar />
      <div style={{ padding: '0px 15px 0px 5px' }} >
        <div className="w-4/5 mx-auto ">

          <h2 className="text-2xl ml-0 font-bold flex justify-between w-3/4">
            <span className=" mt-8">Cliente</span>
          </h2>

          <div className=" mt-10 flex justify-between">
            <label className="relative w-1/2">
              <input
                type="text"
                placeholder="Buscar por nombre"
                value={searchTerm}
                onChange={handleSearch}
                className="p-3 pl-10 border rounded w-full"
              />
              <svg
                className="absolute w-6 h-6 right-3 top-2 text-gray-500 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 16a7 7 0 100-14 7 7 0 000 14zM18.707 17.293a1 1 0 01-1.414 1.414l-4.242-4.242a7 7 0 111.414-1.414l4.242 4.242z"
                  clipRule="evenodd"
                />
              </svg>
            </label>

            <button
              onClick={handleAddClient}
              className="btn bg-stone-300 text-slate-800"
            >
              Nuevo Cliente
            </button>

          </div>

        </div>
        <div className="w-4/5 mx-auto">

          <div className="table-container  mt-10">
            <table className="border-collapse border w-full">    <thead>
              <tr className="bg-stone-300">
                <th className="p-3">Nombre</th>
                <th className="p-3">Email</th>
                <th className="p-3">ClientId</th>
                <th className="p-3">ClientSecret</th>
                <th className="p-3">RefreshToken</th>
                <th className="p-3">ApiKey</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
              <tbody >
                {filteredClients && filteredClients.length > 0 && filteredClients.map((client: Client) => (
                  <tr key={client.id} className="border-b">
                    <td className="p-3">{client.nombre}</td>
                    <td className="p-3 text-center">{client.mail}</td>
                    <td className="p-3 password text-center">{client.clientId}</td>
                    <td className="p-3 password text-center">{client.clientSecret}</td>
                    <td className="p-3 password text-center">{client.refreshToken}</td>
                    <td className="p-3 text-center">{client.apiKey}</td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleModify(client)}
                        className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                        title="Modificar"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
                        title="Eliminar"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="join flex justify-end mb-4">
            {Array.from({ length: Math.ceil(clients.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`join-item btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          {/* Modal para agregar cliente */}
          {
            showModalCliente && (
              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded p-8 w-96">
                  <button
                    className="float-right text-gray-600 cursor-pointer"
                    onClick={handleCloseModal}
                  >
                    Cerrar
                  </button>
                  <h2 className="text-2xl font-bold mb-4">Agregar cliente</h2>
                  <form onSubmit={onSubmit}>
                    {/* Formulario para agregar cliente */}
                    <div className="mb-4">
                      <input
                        type="text"
                        {...register("nombre", {
                          required: { value: true, message: "Nombre es requerido" },
                        })}
                        className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "
                        placeholder="Nombre"
                      />
                      <input
                        type="text"
                        {...register("mail", {
                          required: { value: true, message: "El Email es requerido" },
                        })}
                        className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "
                        placeholder="email"
                      />
                      <input
                        type="text"
                        {...register("clientId", {
                          required: { value: true, message: "El clientId es requerido" },
                        })}
                        className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "
                        placeholder="clientId"
                      />
                      <input
                        type="text"
                        {...register("clientSecret", {
                          required: { value: true, message: "El clientSecret es requerido" },
                        })}
                        className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "
                        placeholder="clientSecret"
                      />
                      <input
                        type="text"
                        {...register("refreshToken", {
                          required: { value: true, message: "El refreshToken es requerido" },
                        })}
                        className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "
                        placeholder="refreshToken"
                      />

                    </div>
                    <button
                      type="submit"
                      className="bg-stone-300 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Guardar
                    </button>
                  </form>
                </div>
              </div>

            )
          }


          {/* Modal para modificar cliente */}
          {
            showModal && selectedClient && (
              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded p-8 w-96">
                  <button
                    className="float-right text-gray-600  cursor-pointer"
                    onClick={handleCloseModal}
                  >
                    Cerrar
                  </button>
                  <h2 className="text-2xl font-bold mb-4">Modificar cliente</h2>
                  <form>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={selectedClient.nombre}
                        onChange={(e) => handleInputChange(e, 'nombre')}
                        className="input-field"
                      />
                      <input
                        type="text"
                        value={selectedClient.mail}
                        onChange={(e) => handleInputChange(e, 'mail')}
                        className="input-field"
                      />
                      <input
                        type="text"
                        value={selectedClient.clientId}
                        onChange={(e) => handleInputChange(e, 'clientId')}
                        className="input-field"
                      />
                      <input
                        type="text"
                        value={selectedClient.clientSecret}
                        onChange={(e) => handleInputChange(e, 'clientSecret')}
                        className="input-field"
                      />
                      <input
                        type="text"
                        value={selectedClient.refreshToken}
                        onChange={(e) => handleInputChange(e, 'refreshToken')}
                        className="input-field"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      className="bg-stone-300 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Guardar cambios
                    </button>
                  </form>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>

  );
};

export default ClientPage;
