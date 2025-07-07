'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

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

  return (
    <div className="w-full h-full bg-gray-200 p-4 overflow-y-auto">
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
    </div>
  );
}