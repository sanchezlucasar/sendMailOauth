import { fetchLogs } from "@/app/log/actions";

const exportRecords = async () => {
    try {
        const logsData: any[] | { error: string } = await fetchLogs();

        // Verificar si logsData es un objeto de error
        if ('error' in logsData) return console.error('Error al obtener los registros:', logsData.error);

        const logsText = logsData.map(log => `${log.texto} - ${new Date(log.createdAt).toLocaleDateString('es-ES')}`).join('\n');
        const blob = new Blob([logsText], { type: 'text/plain' });
        const urlBlob = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = urlBlob;
        link.setAttribute('descargar', 'registros.txt');
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
        console.error('Error exportando los registros:', error);
    }
};

export default exportRecords
