import { Edit, Trash2 } from 'lucide-react';


// --- KOMPONEN: TOMBOL AKSI TABEL ---

/**
 * Komponen Tombol Aksi dalam tabel.
 * [Konten Komponen tidak berubah]
 */
export const ActionButtons = ({ onEdit, onThrash }) => (
    <div className="flex space-x-2">
        <button 
            onClick={onEdit} 
            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition"
            title="Edit Article"
        >
            <Edit size={16} />
        </button>
        <button 
            onClick={onThrash} 
            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
            title="Pindahkan ke Sampah"
        >
            <Trash2 size={16} />
        </button>
    </div>
);