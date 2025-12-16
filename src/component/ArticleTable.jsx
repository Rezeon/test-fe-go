import { Edit, Trash2 } from 'lucide-react';

// --- KOMPONEN: DASHBOARD (ALL POSTS) ---

/**
 * Menampilkan tabel list artikel berdasarkan status.
 * [Konten Komponen tidak berubah]
 */
export const ArticleTable = ({ articles, currentTab, onEdit, onThrash, onDeletePermanent }) => {
    if (articles.length === 0) {
        return <p className="text-center py-8 text-gray-500">Tidak ada artikel dalam status "{currentTab.toLowerCase()}".</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {articles.map((article) => (
                        <tr key={article.id}>
                            {/* Pastikan menggunakan key yang sesuai dari backend Go */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-sm truncate">{article.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                    <button 
                                        onClick={() => onEdit(article)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    
                                    {currentTab === 'Trashed' ? (
                                        <button 
                                            onClick={() => onDeletePermanent(article.id)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                                            title="Hapus Permanen"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => onThrash(article.id)}
                                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50 transition"
                                            title="Pindahkan ke Sampah"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};