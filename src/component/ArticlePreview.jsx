import React, { useState, useEffect, useCallback } from 'react';

// --- KONSTANTA API ---
const API_BASE_URL = 'http://localhost:8080/article';

// --- TIPE DATA ---
const TABS = ['Published', 'Drafts', 'Trashed'];
const ARTICLES_PER_PAGE = 5;


// --- KOMPONEN: PREVIEW ARTIKEL (PUBLIK) ---

/**
 * Menampilkan tampilan blog untuk artikel yang sudah Published.
 */
export const ArticlePreview = () => {
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    // Karena API endpoint paginasinya sederhana, kita akan fetch semua data published
    // dan melakukan pagination di frontend. (Inilah kompromi karena API hanya limit/offset)

    const fetchPublishedOnly = useCallback(async (page = 1) => {
        setLoading(true);
        // Untuk Preview, kita asumsikan fetch semua data lalu filter hanya 'Published'
        // Endpoint yang diberikan: /article/limit/:limit/:offset
        const offset = (page - 1) * 1000; // Ambil banyak untuk memastikan semua published terambil
        
        try {
            // NOTE: Asumsi kita fetch 1000 data dan filter di frontend. 
            // Dalam aplikasi nyata, API harus mendukung filter status.
            const response = await fetch(`${API_BASE_URL}/limit/1000/${offset}`);
            if (!response.ok) throw new Error("Gagal mengambil artikel dari API.");
            
            const allArticles = await response.json();
            
            // Filter hanya yang statusnya "Published"
            const publishedArticles = allArticles.filter(a => a.status === 'Published');
            
            // Terapkan pagination di frontend untuk list published
            const start = (page - 1) * ARTICLES_PER_PAGE;
            const end = start + ARTICLES_PER_PAGE;
            
            setArticles(publishedArticles.slice(start, end));
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching published articles:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPublishedOnly(1);
    }, [fetchPublishedOnly]);

    const handleNextPage = () => {
        // Logika sederhana: jika ada 5 artikel (ARTICLES_PER_PAGE), maka ada halaman berikutnya
        if (articles.length === ARTICLES_PER_PAGE) { 
             fetchPublishedOnly(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            fetchPublishedOnly(currentPage - 1);
        }
    };


    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <h2 className="text-4xl font-extrabold text-indigo-700 border-b-4 border-indigo-200 pb-4">
                Preview Blog (Status: Published)
            </h2>
            
            {loading && <p className="text-center text-indigo-500">Memuat artikel...</p>}
            
            {!loading && articles.length === 0 && (
                <p className="text-center text-gray-500">Belum ada artikel yang dipublikasikan.</p>
            )}

            <div className="grid gap-8">
                {articles.map(article => (
                    <div key={article.id} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 transition-all hover:shadow-xl">
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                            {article.category}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{article.title} || ID: {article.id}</h3>
                        <p className="text-sm text-gray-500 mb-4">Dipublikasikan pada: {article.created_date ? new Date(article.created_date).toLocaleString('id-ID') : 'N/A'}</p>
                        <div className="text-gray-700 line-clamp-3">
                            {article.content.substring(0, 350)}...
                        </div>
                        <a href="#" className="mt-3 inline-block text-indigo-600 font-semibold hover:text-indigo-800">Baca Selengkapnya</a>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                 <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 transition"
                >
                    &larr; Sebelumnya
                </button>
                <span className="text-sm text-gray-600">Halaman {currentPage}</span>
                <button
                    onClick={handleNextPage}
                    disabled={articles.length < ARTICLES_PER_PAGE || loading} // Asumsi jika kurang dari 5, tidak ada halaman berikutnya
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 transition"
                >
                    Berikutnya &rarr;
                </button>
            </div>
        </div>
    );
};

