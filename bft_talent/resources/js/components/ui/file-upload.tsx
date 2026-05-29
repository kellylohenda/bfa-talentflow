import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';

type FileUploadProps = {
    onFileSelect: (file: File | null) => void;
    label: string;
    accept?: string;
    maxSize?: number; // in MB
};

export function FileUpload({ onFileSelect, label, accept = ".pdf,.jpg,.jpeg,.png", maxSize = 5 }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (f: File) => {
        if (f.size > maxSize * 1024 * 1024) {
            setError(`O arquivo excede o limite de ${maxSize}MB.`);
            return;
        }
        setError(null);
        setFile(f);
        onFileSelect(f);
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
        onFileSelect(null);
    };

    return (
        <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#333333] uppercase tracking-widest">{label}</label>
            
            {!file ? (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={`
                        relative border-2 border-dashed rounded-[14px] p-8 transition-all duration-200
                        flex flex-col items-center justify-center gap-4 cursor-pointer
                        ${dragging ? 'border-[#F58220] bg-[#FFF5F0]' : 'border-[#E5E5E5] hover:border-[#F58220] hover:bg-[#F9FAFB]'}
                    `}
                    onClick={() => document.getElementById(`file-input-${label}`)?.click()}
                >
                    <input
                        id={`file-input-${label}`}
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={onSelect}
                    />
                    <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#9CA3AF]">
                        <Upload size={20} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-[#333333]">Arraste seu arquivo aqui</p>
                        <p className="text-xs text-[#6B7280] mt-1">Ou clique para procurar (PDF, JPG até {maxSize}MB)</p>
                    </div>
                </div>
            ) : (
                <div className="relative border border-[#E5E5E5] rounded-[14px] p-4 bg-[#F9FAFB] flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-[#FFF5F0] flex items-center justify-center text-[#F58220]">
                        {file.type.includes('image') ? <CheckCircle2 size={18} /> : <FileText size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#333333] truncate">{file.name}</p>
                        <p className="text-xs text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                        type="button"
                        onClick={removeFile}
                        className="w-8 h-8 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#6B7280] hover:text-red-500 hover:border-red-500 transition-colors"
                    >
                        <X size={14} />
                    </button>
                    
                    {/* Preview for images */}
                    {file.type.includes('image') && (
                        <div className="absolute -top-2 left-4 px-2 py-1 bg-[#F58220] text-white text-[9px] font-bold rounded uppercase tracking-wider shadow-sm">
                            Preview Disponível
                        </div>
                    )}
                </div>
            )}
            
            {error && <p className="text-xs font-bold text-red-500">{error}</p>}
        </div>
    );
}
