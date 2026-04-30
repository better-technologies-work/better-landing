"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { decodeHTML } from "@/lib/utils";
import dynamicImport from 'next/dynamic';

// Estilos del editor
import 'react-quill-new/dist/quill.snow.css';


const ReactQuill = dynamicImport(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-[200px] bg-slate-50 animate-pulse rounded-xl" />
});

const AUTHORS = ["Diego Vargas", "Charlotte Götz", "Ezequiel Alonso", "Victor Menendez", "Yanina Soto"];
const CATEGORIES = ["Framework", "Strategy", "Data", "Engineering", "Marketing", "Case Study"];

// Tipos
type Link = {
  id: string;
  title: string;
  url: string;
};

type Document = {
  id: string;
  name: string;
  url: string;
  type: string;
  file?: File | null;
};

type BlogPost = {
  id: string;
  title: string;
  description: string;
  post_url: string;
  cover_url?: string;
  category: string;
  slug: string;
  published_at: string;
  author: string;
  links?: Link[];
  documents?: Document[];
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'news'>('create');

  // Estados para la imagen
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Estados para links y documentos
  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
  const [documents, setDocuments] = useState<{ name: string; file: File | null; url: string; type?: string }[]>([]);

  // Estados para News
  const [newsPosts, setNewsPosts] = useState<BlogPost[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [editingNews, setEditingNews] = useState<BlogPost | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    description: "",
    author: "Yanina Soto",
    category: "Actualidad",
    post_url: "",
  });
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [newsPreview, setNewsPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    author: "Yanina Soto",
    category: "Data",
    post_url: "",
  });

  useEffect(() => {
    loadPosts();
    loadNews();
  }, []);

  const loadPosts = async () => {
    setLoadingPosts(true);
    try {
      const client = createClient();
      console.log('Supabase client created:', !!client);
      const { data, error } = await client
        .from('blog_posts')
        .select('id,title,description,post_url,cover_url,category,slug,published_at,author,links,documents')
        .order('published_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error loading posts:', error);
        throw error;
      }
      if (data) setPosts(data);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadNews = async () => {
    setLoadingNews(true);
    try {
      const client = createClient();
      const { data } = await client
        .from('blog_posts')
        .select('id,title,description,post_url,cover_url,category,slug,published_at,author')
        .eq('category', 'Actualidad')
        .order('published_at', { ascending: false });
      
      if (data) setNewsPosts(data);
    } catch (err) {
      console.error('Error loading news:', err);
    } finally {
      setLoadingNews(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", author: "Yanina Soto", category: "Data", post_url: "" });
    setImageFile(null);
    setPreview(null);
    setLinks([]);
    setDocuments([]);
    setEditingPost(null);
  };

  const resetNewsForm = () => {
    setNewsForm({ title: "", description: "", author: "Yanina Soto", category: "Actualidad", post_url: "" });
    setNewsImageFile(null);
    setNewsPreview(null);
    setEditingNews(null);
  };

  const handleAddLink = () => {
    setLinks([...links, { title: "", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleAddDocument = () => {
    setDocuments([...documents, { name: "", file: null, url: "" }]);
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleDocumentChange = (index: number, field: 'name' | 'file', value: string | File) => {
    const newDocs = [...documents];
    if (field === 'file') {
      newDocs[index].file = value as File;
      if (value && newDocs[index].name === "") {
        newDocs[index].name = (value as File).name;
      }
    } else {
      newDocs[index].name = value as string;
    }
    setDocuments(newDocs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      try {
        console.log('Creating Supabase client...');
        let client;
        try {
          client = createClient();
          console.log('Client created:', client ? 'yes' : 'no');
          console.log('Client type:', typeof client);
        } catch (clientErr) {
          console.error('Failed to create client:', clientErr);
          throw new Error('Failed to initialize Supabase client: ' + clientErr);
        }
        
        let finalCoverUrl = editingPost?.cover_url || "";

        // 1. Subir imagen si existe
        if (imageFile) {
          console.log('Uploading image...');
          const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
          const { data: uploadData, error: uploadError } = await client.storage
            .from("covers")
            .upload(fileName, imageFile);
          
          console.log('Upload result:', { data: uploadData, error: uploadError });
          if (uploadError) throw new Error("Error subiendo imagen: " + uploadError.message);
          
          const { data } = client.storage.from("covers").getPublicUrl(fileName);
          finalCoverUrl = data.publicUrl;
        }

        // 2. Subir documentos
        const uploadedDocs: Document[] = [];
        for (const doc of documents) {
          if (doc.file) {
            const fileName = `docs/${Date.now()}-${doc.file.name.replace(/\s+/g, '-')}`;
            const { error: uploadError } = await client.storage
              .from("covers")
              .upload(fileName, doc.file);
            
            if (!uploadError) {
              const { data } = client.storage.from("covers").getPublicUrl(fileName);
              uploadedDocs.push({
                id: Date.now().toString() + Math.random(),
                name: doc.name,
                url: data.publicUrl,
                type: doc.file.type
              });
            }
          } else if (doc.url) {
            uploadedDocs.push({
              id: Date.now().toString() + Math.random(),
              name: doc.name,
              url: doc.url,
              type: 'link'
            });
          }
        }

        // 3.  datos del post
        const postData = {
  title: form.title,
  description: form.description,
  author: form.author,
  category: form.category,
  cover_url: finalCoverUrl,
  slug: editingPost
    ? editingPost.slug
    : `${form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
  published_at: editingPost ? editingPost.published_at : new Date().toISOString(),
  post_url: form.post_url || "",
  links: links.filter(l => l.title && l.url),
  documents: uploadedDocs
};

        // 4. Guardar o actualizar en la base de datos
        console.log('Saving post to database:', postData);
        if (editingPost) {
          const { data: updateData, error: dbError } = await client
            .from("blog_posts")
            .update(postData)
            .eq("id", editingPost.id);

          console.log('Update result:', { data: updateData, error: dbError });
          if (dbError) throw dbError;
        } else {
          const { data: insertData, error: dbError } = await client.from("blog_posts").insert([postData]);
          console.log('Insert result:', { data: insertData, error: dbError });
          if (dbError) throw dbError;
        }

        // 5. Éxito y Limpieza
        setSuccess(true);
        resetForm();
        loadPosts();
        setActiveTab('manage');
        setTimeout(() => setSuccess(false), 3000);
      } catch (innerErr: unknown) {
        // Safely extract error message
        let errorMessage = 'Error al publicar el post';
        
        console.error('=== ERROR SUBMISSION ===');
        console.error('Raw error:', innerErr);
        
        if (typeof innerErr === 'string') {
          errorMessage = innerErr;
        } else if (innerErr instanceof Error) {
          errorMessage = innerErr.message;
          console.error('Error constructor:', innerErr.constructor.name);
        } else if (typeof innerErr === 'object' && innerErr !== null) {
          const errObj = innerErr as Record<string, unknown>;
          const errorField = (errObj as { error?: unknown }).error;
          if (typeof errorField === 'object' && errorField !== null && typeof (errorField as { message?: unknown }).message === 'string') {
            errorMessage = (errorField as { message: string }).message;
          } else if (typeof errObj.error_description === 'string') {
            errorMessage = errObj.error_description;
          } else {
            try {
              errorMessage = 'Error: ' + JSON.stringify(errObj);
            } catch {
              errorMessage = 'Error: Unknown error occurred';
            }
          }
        }
        
        console.error('Final error message:', errorMessage);
        console.error('=======================');
        setErrorMsg(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      description: post.description,
      author: post.author || "Yanina Soto",
      category: post.category || "Data",
      post_url: post.post_url || "",
    });
    setPreview(post.cover_url || null);
    setLinks(post.links || []);
    setDocuments((post.documents || []).map((d: Document) => ({ name: d.name, file: null, url: d.url, type: d.type })));
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este post?")) return;
    
    try {
      const client = createClient();
      const { error } = await client.from("blog_posts").delete().eq("id", postId);
      if (error) throw error;
      loadPosts();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setErrorMsg(errorMessage);
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingNews(true);
    setErrorMsg(null);

    try {
      const client = createClient();
      let finalCoverUrl = editingNews?.cover_url || "";

      // 1. Subir imagen si existe
      if (newsImageFile) {
        const fileName = `${Date.now()}-${newsImageFile.name.replace(/\s+/g, '-')}`;
        const { error: uploadError } = await client.storage
          .from("covers")
          .upload(fileName, newsImageFile);
        
        if (uploadError) throw new Error("Error subiendo imagen: " + uploadError.message);
        
        const { data } = client.storage.from("covers").getPublicUrl(fileName);
        finalCoverUrl = data.publicUrl;
      }

      // 2. Preparar datos del post (News siempre tiene categoría "Actualidad")
      const postData = {
        title: newsForm.title,
        description: newsForm.description,
        author: newsForm.author,
        category: "Actualidad",
        cover_url: finalCoverUrl,
        slug: editingNews?.slug || `${newsForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        published_at: editingNews?.published_at || new Date().toISOString(),
        post_url: newsForm.post_url || "",
      };

      // 3. Guardar o actualizar en la base de datos
      if (editingNews) {
        const { error: dbError } = await client
          .from("blog_posts")
          .update(postData)
          .eq("id", editingNews.id);

        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await client.from("blog_posts").insert([postData]);
        if (dbError) throw dbError;
      }

      // 4. Éxito y Limpieza
      setSuccess(true);
      resetNewsForm();
      loadNews();
      setTimeout(() => setSuccess(false), 3000);

    } catch (err: unknown) {
      console.error('Error submitting news:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al publicar la news';
      setErrorMsg(errorMessage);
    } finally {
      setLoadingNews(false);
    }
  };

  const handleEditNews = (post: BlogPost) => {
    setEditingNews(post);
    setNewsForm({
      title: post.title,
      description: post.description,
      author: post.author || "Yanina Soto",
      category: "Actualidad",
      post_url: post.post_url || "",
    });
    setNewsPreview(post.cover_url || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteNews = async (postId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta news?")) return;
    
    try {
      const client = createClient();
      const { error } = await client.from("blog_posts").delete().eq("id", postId);
      if (error) throw error;
      loadNews();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setErrorMsg(errorMessage);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Better Editor</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Hi Team</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab('create'); resetForm(); }}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'create' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              + Nuevo Post
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('news'); resetNewsForm(); }}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'news' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              +  News
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'manage' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              Edit Posts
            </button>
          </div>
        </header>

        {activeTab === 'create' ? (
          <div className="bg-white rounded-[2rem] p-4 md:p-8 shadow-2xl border border-slate-100">
            {editingPost && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl flex justify-between items-center">
                <span className="text-blue-600 text-xs font-black uppercase truncate">Editando: {editingPost.title}</span>
                <button onClick={resetForm} className="text-slate-400 hover:text-red-500 text-xs font-bold whitespace-nowrap">Cancelar</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Post Title</label>
                <input 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all"
                  placeholder="Ej: Reporte de Suministros Abril"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  required
                />
              </div>

              {/* Editor de Texto (Copia y pega aquí tus cuadros/textos) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Content (Pega imágenes, tablas, texto con formato)</label>
                <div className="border-2 border-slate-100 rounded-2xl overflow-hidden bg-white">
                  <ReactQuill 
                    theme="snow" 
                    value={form.description} 
                    onChange={(content) => setForm({...form, description: content})} 
                    placeholder="Pega aquí tus visualizaciones de datos, tablas, imágenes..."
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                  />
                </div>
              </div>

              {/* URL externa opcional */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">External URL (Optional)</label>
                <input 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all"
                  placeholder="https://ejemplo.com (opcional)"
                  value={form.post_url}
                  onChange={(e) => setForm({...form, post_url: e.target.value})}
                />
              </div>

              {/* Subida de Imagen */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Featured Image</label>
                <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center ${preview ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}`}>
                  {preview ? (
                    <div className="relative w-full h-48 mb-4">
                      <img src={preview} className="w-full h-full object-contain rounded-lg" alt="Preview" />
                      <button type="button" onClick={() => {setPreview(null); setImageFile(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">×</button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📊</span>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">Arrastra o selecciona tu imagen</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Links Opcionales */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Links (Opcional)</label>
                  <button type="button" onClick={handleAddLink} className="text-blue-600 text-[10px] font-black uppercase hover:underline">
                    + Agregar Link
                  </button>
                </div>
                {links.map((link, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input 
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-bold focus:border-blue-600 outline-none"
                      placeholder="Título del link"
                      value={link.title}
                      onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                    />
                    <input 
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-bold focus:border-blue-600 outline-none"
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    />
                    <button type="button" onClick={() => handleRemoveLink(index)} className="text-red-500 hover:text-red-700 font-bold px-2">×</button>
                  </div>
                ))}
              </div>

              {/* Documentos Opcionales */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Documentos (Opcional)</label>
                  <button type="button" onClick={handleAddDocument} className="text-blue-600 text-[10px] font-black uppercase hover:underline">
                    + Agregar Documento
                  </button>
                </div>
                {documents.map((doc, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input 
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-bold focus:border-blue-600 outline-none"
                      placeholder="Nombre del documento"
                      value={doc.name}
                      onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                    />
                    <input 
                      type="file"
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 text-sm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDocumentChange(index, 'file', file);
                      }}
                    />
                    <button type="button" onClick={() => handleRemoveDocument(index)} className="text-red-500 hover:text-red-700 font-bold px-2">×</button>
                  </div>
                ))}
              </div>

              {/* Autor y Categoría */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Author</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none"
                    value={form.author}
                    onChange={(e) => setForm({...form, author: e.target.value})}
                  >
                    {AUTHORS.map(author => (
                      <option key={author} value={author}>{author}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none"
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? (editingPost ? "Actualizando..." : "Publicando...") : (editingPost ? "Actualizar Post →" : "Publicar Reporte Ahora →")}
              </button>

              {/* Preview del contenido */}
              {form.description && (
                <div className="space-y-2 mt-8">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vista Previa</label>
                  <div className="border-2 border-slate-100 rounded-2xl p-6 bg-slate-50">
                    <div 
                      className="prose prose-slate max-w-none text-slate-700 text-sm
                        [&>p]:mb-4 [&>img]:my-4 [&>img]:rounded-xl [&>img]:max-w-full
                        [&>strong]:text-slate-900 [&>strong]:font-bold
                        [&>h1]:text-2xl [&>h1]:font-black [&>h1]:mt-6 [&>h1]:mb-3
                        [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-5 [&>h2]:mb-2
                        [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-2
                        [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4
                        [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
                        [&>table]:w-full [&>table]:border-collapse [&>table]:my-4
                        [&>table>th]:bg-slate-200 [&>table>th]:p-2 [&>table>th]:text-left
                        [&>table>td]:p-2 [&>table>td]:border [&>table>td]:border-slate-200"
                      dangerouslySetInnerHTML={{ __html: decodeHTML(form.description) }}
                    />
                  </div>
                </div>
              )}

              {success && <div className="p-4 bg-green-50 text-green-600 rounded-xl text-center text-xs font-black uppercase tracking-widest animate-bounce">✓ {editingPost ? 'Actualizado con éxito' : 'Publicado con éxito'} en Better Blog</div>}
              {errorMsg && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-xs font-bold">{errorMsg}</div>}
            </form>
          </div>
        ) : activeTab === 'news' ? (
          /* Formulario de News */
          <div className="bg-white rounded-[2rem] p-4 md:p-8 shadow-2xl border border-slate-100">
            {editingNews && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl flex justify-between items-center">
                <span className="text-blue-600 text-xs font-black uppercase">Editando: {editingNews.title}</span>
                <button onClick={resetNewsForm} className="text-slate-400 hover:text-red-500 text-xs font-bold">Cancelar</button>
              </div>
            )}

            <form onSubmit={handleNewsSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">News Title</label>
                <input 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all"
                  placeholder="Ej: Nueva tendencia en supply chain"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                  required
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description</label>
                <textarea 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all min-h-[120px]"
                  placeholder="Breve descripción de la noticia..."
                  value={newsForm.description}
                  onChange={(e) => setNewsForm({...newsForm, description: e.target.value})}
                  required
                />
              </div>

              {/* URL externa */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Source URL</label>
                <input 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all"
                  placeholder="https://ejemplo.com (opcional)"
                  value={newsForm.post_url}
                  onChange={(e) => setNewsForm({...newsForm, post_url: e.target.value})}
                />
              </div>

              {/* Subida de Imagen */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Featured Image</label>
                <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center ${newsPreview ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}`}>
                  {newsPreview ? (
                    <div className="relative w-full h-48 mb-4">
                      <img src={newsPreview} className="w-full h-full object-contain rounded-lg" alt="Preview" />
                      <button type="button" onClick={() => {setNewsPreview(null); setNewsImageFile(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">×</button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📰</span>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">Arrastra o selecciona tu imagen</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewsImageFile(file);
                        setNewsPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Autor */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Author</label>
                <select 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none"
                  value={newsForm.author}
                  onChange={(e) => setNewsForm({...newsForm, author: e.target.value})}
                >
                  {AUTHORS.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loadingNews}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
              >
                {loadingNews ? (editingNews ? "Actualizando..." : "Publicando...") : (editingNews ? "Actualizar News →" : "Publicar News Ahora →")}
              </button>

              {/* Preview del contenido */}
              {newsForm.description && (
                <div className="space-y-2 mt-8">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vista Previa</label>
                  <div className="border-2 border-slate-100 rounded-2xl p-6 bg-slate-50">
                    <h3 className="font-black text-lg text-slate-900 mb-2">{newsForm.title}</h3>
                    <p className="text-slate-600 text-sm">{newsForm.description}</p>
                  </div>
                </div>
              )}

              {success && <div className="p-4 bg-green-50 text-green-600 rounded-xl text-center text-xs font-black uppercase tracking-widest animate-bounce">✓ {editingNews ? 'Actualizado con éxito' : 'Publicado con éxito'} en News</div>}
              {errorMsg && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-xs font-bold">{errorMsg}</div>}
            </form>

            {/* Lista de News Existentes */}
            <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-100">
              <h2 className="text-lg md:text-xl font-black uppercase text-slate-900 mb-4 md:mb-6">News Existentes</h2>
              
              {loadingNews ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : newsPosts.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No hay news publicadas aún.</p>
              ) : (
                <div className="space-y-4">
                  {newsPosts.map((post) => (
                    <div key={post.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-all">
                      <div className="w-full sm:w-16 h-16 relative rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        {post.cover_url ? (
                          <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">SIN IMG</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <h3 className="font-black text-sm text-slate-900 truncate">{post.title}</h3>
                        <p className="text-[10px] text-slate-400 uppercase">{post.category} · {new Date(post.published_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handleEditNews(post)}
                          className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full hover:bg-blue-700 transition-all"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteNews(post.id)}
                          className="flex-1 sm:flex-none px-3 py-2 bg-red-50 text-red-500 text-[10px] font-black uppercase rounded-full hover:bg-red-100 transition-all"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-4 md:p-8 shadow-2xl border border-slate-100">
            <h2 className="text-lg md:text-xl font-black uppercase text-slate-900 mb-4 md:mb-6">Posts Existentes</h2>
            
            {loadingPosts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : posts.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No hay posts publicados aún.</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-all">
                    <div className="w-full sm:w-16 h-16 relative rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {post.cover_url ? (
                        <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">SIN IMG</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <h3 className="font-black text-sm text-slate-900 truncate">{post.title}</h3>
                      <p className="text-[10px] text-slate-400 uppercase">{post.category} · {new Date(post.published_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleEdit(post)}
                        className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full hover:bg-blue-700 transition-all"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="flex-1 sm:flex-none px-3 py-2 bg-red-50 text-red-500 text-[10px] font-black uppercase rounded-full hover:bg-red-100 transition-all"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}