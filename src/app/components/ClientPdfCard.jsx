'use client';

import Link from 'next/link';
import { Document, Page, pdfjs } from 'react-pdf';

// Configuración del worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Estilos necesarios para react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// ... (El resto del código de tu tarjeta, como la función getClientColor y el return, se mantiene igual)
const getClientColor = (clientName) => {
    if (!clientName) return '#e5e7eb'; // Color gris por defecto si no hay cliente
    let hash = 0;
    for (let i = 0; i < clientName.length; i++) {
        hash = clientName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 85%)`; // Tono un poco más pastel
    return color;
};

export function ClientPdfCard({ plano }) {
    const { id, alias, nombre_archivo, cliente_nombre } = plano;
    const fileLink = `/planos/view/${id}`;
    const pdfPath = `/planos/${nombre_archivo}`;

    return (
        <Link href={fileLink} className="block h-full">
          <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 bg-white flex flex-col h-full">
            <div className="relative w-full h-80 flex items-center justify-center bg-gray-100 overflow-hidden">
              <Document
                file={pdfPath}
                loading={<div className="text-sm text-gray-500">Cargando...</div>}
                error={<div className="text-sm text-red-500 p-2 text-center">Error al cargar vista previa</div>}
                className="flex justify-center items-center w-full h-full"
              >
                <Page
                  pageNumber={1}
                  width={250}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <span
                className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full self-start mb-2"
                style={{ backgroundColor: getClientColor(cliente_nombre) }}
              >
                {cliente_nombre}
              </span>
              <h3 className="font-bold text-lg text-gray-900 mb-1 truncate" title={alias}>
                {alias}
              </h3>
              <p className="text-gray-500 text-sm truncate flex-grow" title={nombre_archivo}>
                {nombre_archivo}
              </p>
            </div>
          </div>
        </Link>
    );
}