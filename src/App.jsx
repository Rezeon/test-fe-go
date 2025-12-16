import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Edit, Trash2, Eye, Plus, Send, DraftingCompass } from 'lucide-react';
import { ArticleTable } from './component/ArticleTable';
import { ArticleForm } from './component/ArticleForm';
import { ArticlePreview } from './component/ArticlePreview';

// --- KONSTANTA API ---
const API_BASE_URL = 'http://localhost:8080/article';

// --- TIPE DATA ---
const TABS = ['Published', 'Drafts', 'Trashed'];

// Mapping Tab (FE Plural) ke Status Database (BE Singular/Lowercase)
const TAB_TO_STATUS = {
    'Published': 'publish',
    'Drafts': 'draft',
    'Trashed': 'trashed',
};

// Mengambil user ID default karena otentikasi Firebase dihapus,
// tetapi UI masih menampilkannya untuk simulasi.
const defaultUserId = 'user_001_simulated';

// --- KOMPONEN UTAMA APLIKASI ---

const App = () => {
    // Menghilangkan auth Firebase dan menggunakan ID simulasi
    const userId = defaultUserId; 
    const isAuthReady = true; // Langsung true karena tidak ada proses auth

    const [route, setRoute] = useState('dashboard'); // 'dashboard', 'add_new', 'edit', 'preview'
    const [currentTab, setCurrentTab] = useState(TABS[0]); // 'Published', 'Drafts', 'Trashed'
    const [allArticles, setAllArticles] = useState([]); // Menyimpan SEMUA data dari API
    const [loading, setLoading] = useState(false);
    const [articleToEdit, setArticleToEdit] = useState(null);
    const [error, setError] = useState(null);
    console.log("s", allArticles)
    
    // 1. Fetching Semua Artikel dari API Go (Untuk Dashboard)
    const fetchArticles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch 1000 data pertama. Endpoint: /article/limit/:limit/:offset
            const response = await fetch(`${API_BASE_URL}/limit/1000/0`); 
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Gagal mengambil data. Status: ${response.status}`);
            }

            const data = await response.json();
            // Data yang masuk diasumsikan sudah berupa array of Post objects dari Go.
            setAllArticles(data);

        } catch (e) {
            console.error("Error fetching articles:", e);
            setError(`Error saat mengambil data: ${e.message}`);
            setAllArticles([]); // Kosongkan data jika gagal
        } finally {
            setLoading(false);
        }
    }, []);

    // Panggil fetchArticles saat komponen dimuat
    useEffect(() => {
        if (isAuthReady) {
            fetchArticles();
        }
    }, [isAuthReady, fetchArticles]);

    // --- LOGIKA FILTER (useMemo) ---
    
    // Hitung jumlah artikel untuk setiap tab (digunakan di navigasi tab)
    const counts = useMemo(() => {
        return allArticles.reduce((acc, article) => {
            // Kita hitung berdasarkan status BE (publish, draft, trashed)
            const statusKey = article.status.toLowerCase();
            if (statusKey === 'publish') {
                acc.Published++;
            } else if (statusKey === 'draft') {
                acc.Drafts++;
            } else if (statusKey === 'trashed') {
                acc.Trashed++;
            }
            return acc;
        }, { Published: 0, Drafts: 0, Trashed: 0 });
    }, [allArticles]);
    
    // Artikel yang ditampilkan di dashboard (difilter berdasarkan tab)
    const articles = useMemo(() => {
        // Ambil status singular yang diharapkan dari BE berdasarkan Tab yang dipilih
        const expectedStatus = TAB_TO_STATUS[currentTab];
        
        // Lakukan filter berdasarkan status yang sudah dipetakan
        return allArticles
            .filter(a => a.status === expectedStatus)
            .map(a => ({
                // Mapping field dari Go model ke format yang mudah dibaca di UI
                ...a,
                // Format tanggal yang lebih mudah dibaca di UI
                created_date: a.created_date ? new Date(a.created_date).toLocaleString('id-ID') : 'N/A',
            }));
    }, [allArticles, currentTab]);


    // --- HANDLERS (Diperbaiki untuk menghindari window.confirm) ---

    const handleEdit = (article) => {
        setArticleToEdit(article);
        setRoute('edit');
    };

    // Helper function untuk menampilkan pesan notifikasi kustom (menggunakan window.confirm untuk sementara)
    const showConfirmation = (message, onConfirm) => {
        // PERINGATAN: window.confirm sebaiknya diganti dengan modal kustom di lingkungan Canvas.
        const confirmed = window.confirm(message); 
        if (confirmed) {
            onConfirm();
        }
    };


    // Handler untuk mengubah status menjadi 'Trashed' (PUT API)
    const handleThrash = async (id) => {
        showConfirmation("Anda yakin ingin memindahkan artikel ini ke sampah?", async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'trashed' }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Gagal memindahkan ke sampah. Status: ${response.status}`);
                }
                
                // Re-fetch data untuk memperbarui tampilan
                fetchArticles();

            } catch (error) {
                console.error("Error trashing article via API:", error);
                setError(`[API Error] Gagal memindahkan ke sampah: ${error.message}`);
            }
        });
    };
    
    // Handler untuk menghapus permanen (DELETE API)
    const handleDeletePermanent = async (id) => {
        showConfirmation("PERINGATAN: Menghapus artikel ini bersifat permanen. Lanjutkan?", async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Gagal menghapus permanen. Status: ${response.status}`);
                }

                // Re-fetch data untuk memperbarui tampilan
                fetchArticles();

            } catch (error) {
                console.error("Error deleting article permanently via API:", error);
                setError(`[API Error] Gagal menghapus permanen: ${error.message}`);
            }
        });
    };


    const renderContent = () => {
        if (!isAuthReady) {
            return <div className="text-center p-12 text-gray-500">Memuat...</div>;
        }

        // Tampilkan error jika ada
        if (error && route === 'dashboard') {
            return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-7xl mx-auto mt-6" role="alert"><p className="font-bold">Error Koneksi</p><p>{error}</p></div>
        }

        switch (route) {
            case 'dashboard':
                return (
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">All Posts ({currentTab})</h1>
                            <button 
                                onClick={() => setRoute('add_new')}
                                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition flex items-center"
                            >
                                <Plus size={20} className="mr-2" /> Tambah Baru
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setCurrentTab(tab)}
                                        className={`
                                            whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                            ${currentTab === tab
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        {tab} ({counts[tab]})
                                    </button>
                                ))}
                            </nav>
                        </div>
                        
                        {/* Loading State */}
                        {loading && <p className="text-center py-8 text-indigo-500">Memuat data dari API Go...</p>}

                        {/* Table */}
                        {!loading && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <ArticleTable 
                                    articles={articles} // Menggunakan data yang sudah difilter dengan mapping status
                                    currentTab={currentTab}
                                    onEdit={handleEdit}
                                    onThrash={handleThrash}
                                    onDeletePermanent={handleDeletePermanent}
                                />
                            </div>
                        )}
                    </div>
                );
            case 'add_new':
                return <ArticleForm initialArticle={null} onClose={() => setRoute('dashboard')} onSuccess={fetchArticles} />;
            case 'edit':
                return <ArticleForm initialArticle={articleToEdit} onClose={() => setRoute('dashboard')} onSuccess={fetchArticles} />;
            case 'preview':
                // Di preview, kita panggil fetchArticles secara terpisah dengan logika pagination
                return <ArticlePreview />; 
            default:
                return <div className="p-8">404 Not Found</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-indigo-600">Article Manager</h1>
                    <nav className="space-x-4">
                        <button 
                            onClick={() => setRoute('dashboard')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${route === 'dashboard' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <DraftingCompass size={16} className="inline mr-1" /> Dashboard
                        </button>
                        <button 
                            onClick={() => setRoute('preview')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${route === 'preview' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Eye size={16} className="inline mr-1" /> Preview Publik
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {renderContent()}
            </main>
            
            <footer className="py-4 text-center text-sm text-gray-500 border-t mt-10">
                Tes Frontend Sharing Vision 2023 | SIMULATED User ID: {userId} | API: {API_BASE_URL}
            </footer>
        </div>
    );
};

export default App;