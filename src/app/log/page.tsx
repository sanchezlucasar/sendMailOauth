'use client'
import { ToastContainer, toast } from 'react-toastify';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Log } from "@/types";
import '@/app/globals.css';
import exportRecords from '@/Utils/exportRecord';
import { fetchLogs } from './actions';

const LogPage = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { data: logs, isLoading, isError } = useQuery({
    queryKey: ['logs'],
    queryFn: () => fetchLogs()
  });

  const filteredLogs = useMemo(() => {
    if (!logs || !Array.isArray(logs)) return [];

    return logs.filter((log: Log) => {
      const logDate = new Date(log.createdAt);
      if (startDate && endDate) {
        return logDate >= startDate && logDate <= endDate;
      } else if (startDate) {
        return logDate >= startDate;
      } else if (endDate) {
        return logDate <= endDate;
      }
      return true;
    });
  }, [logs, startDate, endDate]);

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    // Si se selecciona la fecha de inicio, reinicia a la primera página
    setCurrentPage(1);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
    // Si se selecciona la fecha de fin, reinicia a la primera página
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleExportRecords = () => {
    if (filteredLogs.length > 0) {
      exportRecords();
    } else {
      // Si no hay registros filtrados, exporta todos los registros
      exportRecords();
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    toast.error('¡Se produjo un error!');
    return <div>Error</div>; // Devolver un mensaje de error o realizar otra acción de manejo de errores según sea necesario
  }
  return (
    <div className="h-screen main-content">
      <div className="w-4/5 mx-auto">
        <h2 className="text-2xl ml-0 font-bold mt-8">Registros de Log</h2>
        <div className="mt-8 flex justify-between">
          <div className="flex items-center">
            <label className="mr-2">Filtrar desde:</label>
            <input
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleStartDateChange(new Date(e.target.value))}
              className="p-3 border rounded mr-4"
            />
            <label className="mr-2">hasta:</label>
            <input
              type="date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleEndDateChange(new Date(e.target.value))}
              className="p-3 border rounded mr-4"
            />
            <button
              onClick={handleExportRecords}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Exportar Registros
            </button>
          </div>
        </div>
        <div className="table-container mt-10">
          <table className="border-collapse border w-full">
            <thead>
              <tr className="bg-stone-300">
                <th className="p-3 text-center">Texto</th>
                <th className="p-3 text-center">Fecha de Creación</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log: Log) => (
                <tr key={log.id} className="border-b">
                  <td className="p-3">{log.texto}</td>
                  <td className="p-3 text-center">{new Date(log.createdAt).toLocaleDateString('es-ES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          {Array.from({ length: Math.ceil(filteredLogs.length / itemsPerPage) }).map((_, index) => (
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
  );
};

export default LogPage;
