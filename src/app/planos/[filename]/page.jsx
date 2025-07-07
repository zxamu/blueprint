import { PdfViewer } from '@/app/components/PdfViewer';

export default function ViewPlanoPage({ params }) {
  const { filename } = params;
  
  // Decodificar el nombre del archivo si contiene caracteres como %20 en lugar de espacios
  const decodedFilename = decodeURIComponent(filename);

  return (
    <div className="flex flex-col h-full">
       <h1 className="text-3xl font-bold mb-4 text-black-900 flex-shrink-0">{decodedFilename}.pdf</h1>
       <div className="flex-grow">
          <PdfViewer file={decodedFilename} />
       </div>
    </div>
  );
}