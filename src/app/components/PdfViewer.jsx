'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaDownload, FaExternalLinkAlt } from 'react-icons/fa';

// Configuración del worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Estilos necesarios para react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export function PdfViewer({ file }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const pdfPath = `/planos/${file}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = file; // Usa el nombre del archivo para la descarga
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    window.open(pdfPath, '_blank', 'noopener,noreferrer');
  };

  return (
    // Contenedor principal con posición relativa
    <div className="relative w-full h-full bg-gray-200 overflow-y-auto">
      <Document
        file={pdfPath}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<p className="text-center text-gray-600">Cargando PDF...</p>}
        error={<p className="text-center text-red-500">Error al cargar el PDF. Verifica que el archivo exista en la carpeta 'public/planos'.</p>}
        className="flex flex-col items-center"
      >
        {Array.from(new Array(numPages || 0), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderAnnotationLayer={true}
            renderTextLayer={true}
            className="mb-4 shadow-lg"
          />
        ))}
      </Document>

      {/* --- Botones Flotantes --- */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col space-y-2">
        <button
          onClick={handleDownload}
          className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          title="Descargar PDF"
        >
          <FaDownload />
        </button>
        <button
          onClick={handleOpenNewTab}
          className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          title="Ver en nueva pestaña"
        >
          <FaExternalLinkAlt />
        </button>
      </div>
    </div>
  );
}