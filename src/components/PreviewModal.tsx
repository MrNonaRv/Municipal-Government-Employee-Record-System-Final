import React, { useState, useEffect } from 'react';
import { Attachment } from '../types/employee';
import { X, Loader2 } from 'lucide-react';

interface PreviewModalProps {
  doc: Attachment;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ doc, onClose }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doc.driveFileId) {
      setLoading(false);
      return;
    }
    if (!doc.fileData || doc.fileType !== 'application/pdf') {
      setLoading(false);
      return;
    }
        
    let active = true;
    fetch(doc.fileData)
      .then(res => res.blob())
      .then(blob => {
        if (active) {
          setBlobUrl(URL.createObjectURL(blob));
          setLoading(false);
        }
      })
      .catch(e => {
        console.error(e);
        if (active) setLoading(false);
      });
      
    return () => {
      active = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [doc]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col relative" onClick={e => e.stopPropagation()}>
        <div className="p-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex flex-col">
            <h3 className="font-extrabold text-lg text-slate-800">{doc.name}</h3>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{doc.fileType || 'Document'}</span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-slate-100/50 p-6 flex justify-center relative min-h-[60vh]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="animate-spin mb-4" size={32} />
              <span className="text-sm font-bold uppercase tracking-widest">Processing Document...</span>
            </div>
          ) : doc.fileType.startsWith('image/') ? (
            <img 
               src={doc.fileData || doc.driveWebContentLink || doc.driveWebViewLink} 
               alt={doc.name} 
               className="max-w-full h-auto object-contain rounded shadow-sm border border-slate-200" 
             />
          ) : doc.fileType === 'application/pdf' ? (
             <iframe
                src={doc.driveFileId ? `https://drive.google.com/file/d/${doc.driveFileId}/preview` : (blobUrl ? `${blobUrl}#view=FitH` : '')}
                className="w-full h-full min-h-[70vh] rounded shadow-sm border border-slate-200 bg-white"
                title={doc.name}
             />
          ) : doc.driveFileId ? (
             <iframe
                src={`https://drive.google.com/file/d/${doc.driveFileId}/preview`}
                className="w-full h-full min-h-[70vh] rounded shadow-sm border border-slate-200 bg-white"
                title={doc.name}
             />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 w-full h-full">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-xl font-bold">?</span>
              </div>
              <p className="font-bold text-slate-700">Preview not supported</p>
              <p className="text-xs mt-2 max-w-sm">This file type ({doc.fileType}) cannot be previewed directly in the browser. Please download it to view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};