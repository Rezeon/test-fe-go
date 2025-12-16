import React, { useState } from 'react';
import { Send, DraftingCompass } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/article';

// --- KOMPONEN: FORM ARTIKEL (ADD NEW / EDIT) ---
 
 /**
  * Form untuk menambah atau mengedit artikel.
  * @param {object} props
  * @param {object | null} props.initialArticle - Data artikel awal (untuk Edit), null untuk Add New
  * @param {function} props.onClose - Handler menutup form (kembali ke dashboard)
  * @param {function} props.onSuccess - Handler setelah sukses (untuk re-fetch data)
  */
export const ArticleForm = ({ initialArticle, onClose, onSuccess }) => {
     const isEditMode = initialArticle !== null;
     const [title, setTitle] = useState(initialArticle?.title || '');
     const [content, setContent] = useState(initialArticle?.content || '');
     const [category, setCategory] = useState(initialArticle?.category || '');
     const [error, setError] = useState(null);
     const [isSubmitting, setIsSubmitting] = useState(false);
 
     const validate = () => {
         if (title.length < 20) return "Judul minimal 20 karakter.";
         if (content.length < 200) return "Konten minimal 200 karakter.";
         if (category.length < 3) return "Kategori minimal 3 karakter.";
         return null;
     };
 
     const handleSubmit = async (status) => {
         const validationError = validate();
         if (validationError) {
             setError(validationError);
             return;
         }
 
         setIsSubmitting(true);
         setError(null);
 
         const articleData = {
             title,
             content,
             category,
             // Status akan diisi berdasarkan tombol yang diklik
             status, 
         };
 
         const method = isEditMode ? 'PUT' : 'POST';
         const url = isEditMode ? `${API_BASE_URL}/${initialArticle.id}` : API_BASE_URL + '/';
 
         try {
             const response = await fetch(url, {
                 method: method,
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(articleData),
             });
 
             if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.error || `Gagal ${isEditMode ? 'mengupdate' : 'membuat'} artikel. Status: ${response.status}`);
             }
             
             // Sukses: panggil onSuccess untuk re-fetch data di dashboard
             onSuccess(); 
             onClose(); 
 
         } catch (e) {
             console.error("Error saving document via API: ", e);
             setError(`[API Error] ${e.message}`);
         } finally {
             setIsSubmitting(false);
         }
     };
 
     const buttonClass = (color) => `
         px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-200
         ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'}
         ${color === 'publish' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-500 hover:bg-gray-600'}
     `;
 
     return (
         <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl space-y-6">
             <h2 className="text-3xl font-bold text-gray-900 border-b pb-4">
                 {isEditMode ? 'Edit Artikel' : 'Tambah Artikel Baru'}
             </h2>
             
             {error && (
                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
                     <p className="font-bold">Error API/Validasi</p>
                     <p>{error}</p>
                 </div>
             )}
 
             <form className="space-y-6">
                 <div>
                     <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul (Min 20 Karakter)</label>
                     <input 
                         id="title" 
                         type="text" 
                         value={title} 
                         onChange={(e) => setTitle(e.target.value)}
                         className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                         disabled={isSubmitting}
                     />
                 </div>
                 <div>
                     <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori (Min 3 Karakter)</label>
                     <input 
                         id="category" 
                         type="text" 
                         value={category} 
                         onChange={(e) => setCategory(e.target.value)}
                         className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                         disabled={isSubmitting}
                     />
                 </div>
                 <div>
                     <label htmlFor="content" className="block text-sm font-medium text-gray-700">Konten (Min 200 Karakter)</label>
                     <textarea 
                         id="content" 
                         rows="10" 
                         value={content} 
                         onChange={(e) => setContent(e.target.value)}
                         className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                         disabled={isSubmitting}
                     ></textarea>
                 </div>
             </form>
 
             <div className="flex justify-between pt-4 border-t">
                 <button 
                     onClick={() => onClose()}
                     className="px-6 py-3 text-gray-700 bg-gray-200 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-all duration-200"
                     disabled={isSubmitting}
                 >
                     Batal
                 </button>
                 <div className="space-x-4">
                     <button 
                         onClick={() => handleSubmit('draft')}
                         className={buttonClass('draft')}
                         disabled={isSubmitting}
                     >
                         <DraftingCompass size={20} className="inline mr-2" />
                         Simpan sebagai Draft
                     </button>
                     <button 
                         onClick={() => handleSubmit('publish')}
                         className={buttonClass('publish')}
                         disabled={isSubmitting}
                     >
                         <Send size={20} className="inline mr-2" />
                         Publish Artikel
                     </button>
                 </div>
             </div>
         </div>
     );
 };