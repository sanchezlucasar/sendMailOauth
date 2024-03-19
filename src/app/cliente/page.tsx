'use client'

import { useState, useMemo, FormEvent } from 'react';
import { Client } from '@/types';
import { useDebounce } from '@/Hooks/useDebounce'; import '@/app/globals.css';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createClients, deleteClient, fetchClients, updateClient } from './actions';

const ClientPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchValue, 400);
  const itemsPerPage = 4;
  const queryClient = useQueryClient();

  const { data: clients, error, isLoading, isError } = useQuery({
    queryKey: ['clients', debouncedSearchTerm],
    queryFn: () => fetchClients(debouncedSearchTerm)
  });


  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues: { [key: string]: any } = {};
    //@ts-ignore
    for (let [key, value] of formData.entries()) {
      formValues[key] = value;
    }
    const response = createClients(formValues);
    if ('error' in response) {
      const error = response.error;
      toast.error(`Error al crear el cliente: ${error}`
      );
    } else {
      toast.success('Cliente creado exitosamente');
      setShowModal(false)
      queryClient.invalidateQueries();
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof Client) => {
    if (selectedClient) {
      setSelectedClient({
        ...selectedClient,
        [field]: event.target.value
      });
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const paginatedClients = useMemo(() => {
    if (!clients) return []
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return clients.slice(startIndex, endIndex);
  }, [clients, currentPage, itemsPerPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    toast.error('¡Se produjo un error al cargar la información!');
  }

  return (
    <div className="h-screen main-content">
      <div style={{ padding: '0px 15px 0px 5px' }}>
        <div className="w-4/5 mx-auto">
          <h2 className="text-2xl ml-0 font-bold flex justify-between w-3/4">
            <span className=" mt-8">Cliente</span>
          </h2>
          <div className=" mt-10 flex justify-between">
            <label className="relative w-1/2">
              <input
                type="text"
                placeholder="Buscar por nombre"
                value={searchValue}
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
              onClick={() => {
                setSelectedClient(null);
                setShowModal(true);
              }}
              className="btn bg-stone-300 text-slate-800"
            >
              Nuevo Cliente
            </button>
          </div>
        </div>
        <div className="w-4/5 mx-auto">
          <div className="table-container  mt-10">
            <table className="border-collapse border w-full">
              <thead>
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
              <tbody>
                {paginatedClients.map((client: Client) => (
                  <tr key={client.id} className="border-b">
                    <td className="p-3">{client.nombre}</td>
                    <td className="p-3 text-center">{client.mail}</td>
                    <td className="p-3 password text-center">{client.clientId}</td>
                    <td className="p-3 password text-center">{client.clientSecret}</td>
                    <td className="p-3 password text-center">{client.refreshToken}</td>
                    <td className="p-3 text-center">{client.apiKey}</td>
                    <td className="p-3 text-center flex justify-center">
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowModal(true)
                        }}
                        className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                        title="Modificar"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          const result = deleteClient(client.id);
                          if ('error' in result) {
                            const error = result.error;
                            toast.error(`Error al eliminar el cliente: ${error}`
                            );
                          } else {
                            toast.success('Cliente eliminado exitosamente');
                            queryClient.invalidateQueries();
                          }
                        }}
                        className="bg-red-400 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
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
          <div className="mt-8 flex justify-end">
            {clients && Array.from({ length: Math.ceil(clients.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para modificar cliente */}
      {selectedClient ? (
        showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded p-8 w-96">
              <button
                className="float-right text-gray-600 cursor-pointer"
                onClick={() => setShowModal(false)}
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
                    className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "

                  />
                  <input
                    type="text"
                    value={selectedClient.mail}
                    onChange={(e) => handleInputChange(e, 'mail')}
                    className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "

                  />
                  <input
                    type="text"
                    value={selectedClient.clientId}
                    onChange={(e) => handleInputChange(e, 'clientId')}
                    className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "

                  />
                  <input
                    type="text"
                    value={selectedClient.clientSecret}
                    onChange={(e) => handleInputChange(e, 'clientSecret')}
                    className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "

                  />
                  <input
                    type="text"
                    value={selectedClient.refreshToken}
                    onChange={(e) => handleInputChange(e, 'refreshToken')}
                    className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "

                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const result = updateClient(selectedClient);
                    if ('error' in result) {
                      const error = result.error;
                      toast.error(`Error al modificar el cliente: ${error}`
                      );
                    } else {
                      queryClient.invalidateQueries();
                      setShowModal(false)
                      toast.success('Cliente modificado exitosamente');
                    }
                  }}
                  className="bg-stone-300 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Guardar cambios
                </button>
              </form>
            </div>
          </div>
        )
      ) : (showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-8 w-96">
            <button
              className="float-right text-gray-600 cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
            <h2 className="text-2xl font-bold mb-4">Agregar cliente</h2>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="nombre"
                  required
                  className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "
                  placeholder="Nombre"
                />
                <input
                  type="email"
                  name="mail"
                  required

                  className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "
                  placeholder="email"
                />
                <input
                  type="text"
                  name="clientId"
                  required
                  className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "
                  placeholder="clientId"
                />
                <input
                  type="text"
                  name="clientSecret"
                  required
                  className=" p-3 text-slate-600 rounded block mb-2  bg-slate-100 text-slate-300 w-full input-lg w-full "
                  placeholder="clientSecret"
                />
                <input
                  type="text"
                  name="refreshToken"
                  required
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
        </div>)
      )}
    </div >

  )
};

export default ClientPage;
