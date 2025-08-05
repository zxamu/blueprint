'use client';

import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export function VersionCard({ version, isSelected, onClick }) {
  const pdfPath = `/planos/${version.nombre_archivo_version}`;
  const uploadDate = new Date(version.fecha_subida).toLocaleDateString();

  // Clases condicionales para el borde
  const borderClass = isSelected
    ? 'border-2 border-indigo-500'
    : 'border border-gray-200';

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-32 h-full p-2 bg-white rounded-lg shadow text-center flex flex-col justify-between transition-all hover:shadow-lg ${borderClass}`}
    >
      <div className="w-full h-16 flex items-center justify-center overflow-hidden bg-gray-100 rounded">
        <Document
          file={pdfPath}
          loading={<div className="text-xs text-gray-400">...</div>}
          error={<div className="text-xs text-red-400">X</div>}
        >
          <Page pageNumber={1} height={64} renderTextLayer={false} renderAnnotationLayer={false} />
        </Document>
      </div>
      <p className="text-xs mt-1 truncate text-gray-800" title={version.nombre_archivo_version}>
        {version.nombre_archivo_version}
      </p>
      <p className="text-xs text-gray-500">{uploadDate}</p>
    </button>
  );
}