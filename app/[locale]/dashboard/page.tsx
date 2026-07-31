"use client";

import { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { decodeHTML } from "@/lib/utils";
import { detectVideoSource, getYouTubeVideoId, getVimeoVideoId, type VideoSource } from "@/lib/video-utils";
import dynamicImport from 'next/dynamic';
import { useLocale } from "next-intl";
import Header from "@/components/Header";
import DashboardAuth from "@/components/DashboardAuth";
import VideoPlayer from "@/components/VideoPlayer";
import { applyImageWidthAtIndex, deleteImageAtIndex, registerImageWidthFormat, findImageIndex } from "@/lib/quill-image-resize";
import { registerQuillExtensions, insertTable, addTableRow, addTableColumn, removeTableRow, removeTableColumn } from "@/lib/quill-extensions";

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
  video_url?: string;
  video_source?: VideoSource | null;
  category: string;
  slug: string;
  published_at: string;
  updated_at?: string;
  author: string;
  links?: Link[];
  documents?: Document[];
};

export default function DashboardPage() {
  const locale = useLocale();
  const isEs = locale === "es";
  const ui = {
    hiTeam: isEs ? "Hola equipo" : "Hi Team",
    newPost: isEs ? "+ Nuevo Post" : "+ New Post",
    news: isEs ? "+ Noticias" : "+ News",
    editPosts: isEs ? "Editar Posts" : "Edit Posts",
    editing: isEs ? "Editando" : "Editing",
    cancel: isEs ? "Cancelar" : "Cancel",
    postTitle: isEs ? "Titulo del post" : "Post Title",
    content: isEs ? "Contenido (pega imagenes, tablas y texto con formato)" : "Content (paste images, tables, formatted text)",
    contentPlaceholder: isEs ? "Pega aqui tus visualizaciones, tablas e imagenes..." : "Paste your data visualizations, tables, images...",
    externalUrl: isEs ? "URL externa (opcional)" : "External URL (Optional)",
    featuredImage: isEs ? "Imagen destacada" : "Featured Image",
    dragImage: isEs ? "Arrastra o selecciona tu imagen" : "Drag or select your image",
    linksOptional: isEs ? "Links (Opcional)" : "Links (Optional)",
    addLink: isEs ? "+ Agregar Link" : "+ Add Link",
    documentsOptional: isEs ? "Documentos (Opcional)" : "Documents (Optional)",
    addDocument: isEs ? "+ Agregar Documento" : "+ Add Document",
    author: isEs ? "Autor" : "Author",
    category: isEs ? "Categoria" : "Category",
    updating: isEs ? "Actualizando..." : "Updating...",
    publishing: isEs ? "Publicando..." : "Publishing...",
    updatePost: isEs ? "Actualizar Post →" : "Update Post →",
    publishNow: isEs ? "Publicar Reporte Ahora →" : "Publish Report Now →",
    preview: isEs ? "Vista Previa" : "Preview",
    successPost: isEs ? "Actualizado con exito" : "Updated successfully",
    successPostCreate: isEs ? "Publicado con exito" : "Published successfully",
    newsTitle: isEs ? "Titulo de noticia" : "News Title",
    description: isEs ? "Descripcion" : "Description",
    sourceUrl: isEs ? "URL fuente" : "Source URL",
    publishNewsNow: isEs ? "Publicar Noticia Ahora →" : "Publish News Now →",
    updateNews: isEs ? "Actualizar Noticia →" : "Update News →",
    existingNews: isEs ? "Noticias existentes" : "Existing News",
    noNewsYet: isEs ? "No hay noticias publicadas aun." : "No news published yet.",
    edit: isEs ? "Editar" : "Edit",
    delete: isEs ? "Eliminar" : "Delete",
    existingPosts: isEs ? "Posts existentes" : "Existing Posts",
    noPostsYet: isEs ? "No hay posts publicados aun." : "No posts published yet.",
    noImg: isEs ? "SIN IMG" : "NO IMG",
    featuredVideo: isEs ? "Video destacado" : "Featured Video",
    dragVideo: isEs ? "Arrastra o selecciona tu video" : "Drag or select your video",
  };
  type QuillEditorHandle = {
    getEditor: () => {
      root: HTMLElement;
      getSelection: () => { index: number; length: number } | null;
      deleteText: (index: number, length: number) => void;
      getLeaf: (index: number) => Array<{ domNode?: HTMLElement | null }>;
      getContents: () => { ops?: Array<{ insert?: string | { image?: string } }> };
    } | null;
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'news'>('create');
  const reactQuillRef = useRef<QuillEditorHandle | null>(null);
  const savedSelectionRef = useRef<{ index: number; length: number } | null>(null);
  const selectedImageRef = useRef<HTMLImageElement | null>(null);

  const captureImageSelection = () => {
    const editor = reactQuillRef.current?.getEditor();
    const sel = editor?.getSelection();
    if (sel) savedSelectionRef.current = sel;
  };

  const handleEditorImageClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    const clickedImage = target?.closest("img") as HTMLImageElement | null;
    if (clickedImage) {
      selectedImageRef.current = clickedImage;
    }
  };

  const syncEditorContent = () => {
    const editor = reactQuillRef.current?.getEditor();
    const editorEl = editor?.root;
    if (editor && editorEl) {
      setForm(prev => ({ ...prev, description: editorEl.innerHTML }));
    }
  };

  // Estados para la imagen
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  // Estados para el video
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoRemoved, setVideoRemoved] = useState(false);
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState("");

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
  const [newsImageRemoved, setNewsImageRemoved] = useState(false);

  // Estados para el video de noticias
  const [newsVideoFile, setNewsVideoFile] = useState<File | null>(null);
  const [newsVideoPreview, setNewsVideoPreview] = useState<string | null>(null);
  const [newsVideoRemoved, setNewsVideoRemoved] = useState(false);
  const [newsVideoSource, setNewsVideoSource] = useState<VideoSource | null>(null);
  const [newsVideoUrlInput, setNewsVideoUrlInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    author: "Yanina Soto",
    category: "Data",
    post_url: "",
    slug: "",
  });

  useEffect(() => {
    registerImageWidthFormat().catch((err) => console.error('[QUILL] Failed to register width format:', err));
    // Register custom Quill extensions after editor is mounted
    const editor = reactQuillRef.current?.getEditor();
    if (editor) {
      registerQuillExtensions(editor);
    }
    loadPosts();
    loadNews();
  }, []);

  useEffect(() => {
    const editor = reactQuillRef.current?.getEditor();
    const root = editor?.root;

    if (!root) return;

    const handleImageSelection = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const clickedImage = target?.closest("img") as HTMLImageElement | null;
      if (clickedImage) {
        selectedImageRef.current = clickedImage;
      }
    };

    root.addEventListener("click", handleImageSelection);
    return () => root.removeEventListener("click", handleImageSelection);
  }, [activeTab]);

  const loadPosts = async () => {
    setLoadingPosts(true);
    try {
      const client = createClient();
      console.log('Supabase client created:', !!client);
      const { data, error } = await client
        .from('blog_posts')
        .select('id,title,description,post_url,cover_url,video_url,video_source,category,slug,published_at,updated_at,author,links,documents')
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
        .select('id,title,description,post_url,cover_url,video_url,video_source,category,slug,published_at,updated_at,author')
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
    setForm({ title: "", description: "", author: "Yanina Soto", category: "Data", post_url: "",slug: "", });
    setImageFile(null);
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(null);
    setImageRemoved(false);
    setVideoFile(null);
    if (videoPreview?.startsWith('blob:')) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
    setVideoRemoved(false);
    setVideoSource(null);
    setVideoUrlInput("");
    setLinks([]);
    setDocuments([]);
    setEditingPost(null);
  };

  const resetNewsForm = () => {
    setNewsForm({ title: "", description: "", author: "Yanina Soto", category: "Actualidad", post_url: "" });
    setNewsImageFile(null);
    if (newsPreview?.startsWith('blob:')) URL.revokeObjectURL(newsPreview);
    setNewsPreview(null);
    setNewsImageRemoved(false);
    setNewsVideoFile(null);
    if (newsVideoPreview?.startsWith('blob:')) URL.revokeObjectURL(newsVideoPreview);
    setNewsVideoPreview(null);
    setNewsVideoRemoved(false);
    setNewsVideoSource(null);
    setNewsVideoUrlInput("");
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
        let finalVideoUrl = videoRemoved ? "" : (editingPost?.video_url || "");
        let finalVideoSource: VideoSource | null = videoRemoved ? null : (editingPost?.video_source || null);

        console.log('[VIDEO FLOW] Initial state:', {
          videoRemoved,
          editingPostVideoUrl: editingPost?.video_url,
          editingPostVideoSource: editingPost?.video_source,
          videoUrlInput,
          videoFile: videoFile?.name,
          finalVideoUrl,
          finalVideoSource,
        });

        // Si se pegó un link, usarlo como video
        if (videoUrlInput.trim()) {
          console.log('[VIDEO FLOW] URL input provided:', videoUrlInput.trim());
          finalVideoUrl = videoUrlInput.trim();
          finalVideoSource = detectVideoSource(videoUrlInput.trim());
          console.log('[VIDEO FLOW] Detected source:', finalVideoSource);
          // Si había un archivo subido antes, limpiarlo
          if (editingPost?.video_url && editingPost?.video_source === 'upload') {
            try {
              const oldVideoPath = editingPost.video_url.replace(/.*\/covers\//, '');
              console.log('[VIDEO FLOW] Removing old uploaded video from Storage:', oldVideoPath);
              const { error: removeErr } = await client.storage.from("covers").remove([oldVideoPath]);
              if (removeErr) console.error('[VIDEO FLOW] Error removing old video:', removeErr);
              else console.log('[VIDEO FLOW] Old uploaded video removed successfully');
            } catch (e) {
              console.error('[VIDEO FLOW] Exception removing old video:', e);
            }
          } else {
            console.log('[VIDEO FLOW] No old uploaded video to clean up');
          }
        } else if (videoFile) {
          // Subir archivo
          console.log('[VIDEO FLOW] New video file provided:', videoFile.name);
          finalVideoSource = 'upload';
          // Eliminar video viejo de Storage si se reemplaza
          if (editingPost?.video_url && editingPost?.video_source === 'upload') {
            try {
              const oldVideoPath = editingPost.video_url.replace(/.*\/covers\//, '');
              console.log('[VIDEO FLOW] Removing old uploaded video from Storage:', oldVideoPath);
              const { error: removeErr } = await client.storage.from("covers").remove([oldVideoPath]);
              if (removeErr) console.error('[VIDEO FLOW] Error removing old video:', removeErr);
              else console.log('[VIDEO FLOW] Old uploaded video removed successfully');
            } catch (e) {
              console.error('[VIDEO FLOW] Exception removing old video:', e);
            }
          } else {
            console.log('[VIDEO FLOW] No old uploaded video to clean up');
          }
        } else if (videoRemoved) {
          console.log('[VIDEO FLOW] Video marked for removal');
          // Si se eliminó el video, limpiar solo Storage si era upload
          if (editingPost?.video_url && editingPost?.video_source === 'upload') {
            try {
              const oldVideoPath = editingPost.video_url.replace(/.*\/covers\//, '');
              console.log('[VIDEO FLOW] Removing uploaded video from Storage:', oldVideoPath);
              const { error: removeErr } = await client.storage.from("covers").remove([oldVideoPath]);
              if (removeErr) console.error('[VIDEO FLOW] Error removing video:', removeErr);
              else console.log('[VIDEO FLOW] Uploaded video removed successfully');
            } catch (e) {
              console.error('[VIDEO FLOW] Exception removing video:', e);
            }
          } else if (editingPost?.video_url) {
            console.log('[VIDEO FLOW] Video is URL-based (source:', editingPost.video_source, ') - no Storage cleanup needed');
          } else {
            console.log('[VIDEO FLOW] No existing video to clean up');
          }
          finalVideoUrl = "";
          finalVideoSource = null;
        } else {
          console.log('[VIDEO FLOW] No video changes - keeping existing state');
        }

        console.log('[VIDEO FLOW] Final state:', { finalVideoUrl, finalVideoSource });

        // Eliminar imagen vieja de Storage si se reemplaza
        if (editingPost?.cover_url && imageFile) {
          try {
            const oldImagePath = editingPost.cover_url.replace(/.*\/covers\//, '');
            console.log('[IMAGE FLOW] Removing old cover image from Storage:', oldImagePath);
            const { error: imgErr } = await client.storage.from("covers").remove([oldImagePath]);
            if (imgErr) console.error('[IMAGE FLOW] Error removing old image:', imgErr);
            else console.log('[IMAGE FLOW] Old cover image removed successfully');
          } catch (e) {
            console.error('[IMAGE FLOW] Exception removing old image:', e);
          }
        }

        // Eliminar imagen destacada si el usuario la quitó con el botón ×
        if (imageRemoved && editingPost?.cover_url && !imageFile) {
          try {
            const oldImagePath = editingPost.cover_url.replace(/.*\/covers\//, '');
            console.log('[COVER SUBMIT] Removing cover image from Storage:', oldImagePath);
            const { error: imgErr } = await client.storage.from("covers").remove([oldImagePath]);
            if (imgErr) console.error('[COVER SUBMIT] Error removing cover:', imgErr);
            else console.log('[COVER SUBMIT] Cover removed successfully');
          } catch (e) {
            console.error('[COVER SUBMIT] Exception removing cover:', e);
          }
          finalCoverUrl = "";
        }

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

        // 1b. Subir video si existe (modo archivo)
        if (videoFile && finalVideoSource === 'upload') {
          console.log('Uploading video...');
          const videoName = `videos/${Date.now()}-${videoFile.name.replace(/\s+/g, '-')}`;
          const { error: videoUploadError } = await client.storage
            .from("covers")
            .upload(videoName, videoFile);
          
          if (videoUploadError) throw new Error("Error subiendo video: " + videoUploadError.message);
          
          const { data: videoData } = client.storage.from("covers").getPublicUrl(videoName);
          finalVideoUrl = videoData.publicUrl;
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
        console.log('[COVER SUBMIT] Final cover_url to save:', finalCoverUrl, '| imageRemoved:', imageRemoved, '| imageFile:', imageFile?.name);
        const postData = {
  title: form.title,
  description: form.description,
  author: form.author,
  category: form.category,
  cover_url: finalCoverUrl,
  video_url: finalVideoUrl,
  video_source: finalVideoSource,
  slug: form.slug || form.title.toLowerCase()
  .replace(/[^a-z0-9\s]+/g, "")
  .trim()
  .replace(/\s+/g, "-"),
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
        let errorMessage = isEs ? 'Error al publicar el post' : 'Error publishing post';
        
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
      slug: post.slug || "",
    });
    setPreview(post.cover_url || null);
    setVideoPreview(post.video_url || null);
    setVideoSource(post.video_source || null);
    setVideoUrlInput(post.video_source === 'upload' || !post.video_url ? '' : (post.video_url || ''));
    setLinks(post.links || []);
    setDocuments((post.documents || []).map((d: Document) => ({ name: d.name, file: null, url: d.url, type: d.type })));
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (postId: string) => {
    if (!confirm(isEs ? "¿Estás seguro de que quieres eliminar este post?" : "Are you sure you want to delete this post?")) return;
    
    try {
      const client = createClient();
      console.log('[DELETE POST] Starting deletion for post:', postId);

      // Fetch the post first to get Storage file paths
      const { data: postData, error: fetchError } = await client
        .from('blog_posts')
        .select('cover_url, video_url, video_source, documents')
        .eq('id', postId)
        .single();

      if (fetchError) {
        console.error('[DELETE POST] Error fetching post for cleanup:', fetchError);
      }

      // Clean up Storage files
      if (postData) {
        // Delete cover image
        if (postData.cover_url) {
          try {
            const imagePath = postData.cover_url.replace(/.*\/covers\//, '');
            console.log('[DELETE POST] Removing cover image from Storage:', imagePath);
            const { error: imgErr } = await client.storage.from("covers").remove([imagePath]);
            if (imgErr) console.error('[DELETE POST] Error removing cover image:', imgErr);
            else console.log('[DELETE POST] Cover image removed successfully');
          } catch (e) {
            console.error('[DELETE POST] Exception removing cover image:', e);
          }
        }

        // Delete video file (only for uploaded videos)
        if (postData.video_url && postData.video_source === 'upload') {
          try {
            const videoPath = postData.video_url.replace(/.*\/covers\//, '');
            console.log('[DELETE POST] Removing uploaded video from Storage:', videoPath);
            const { error: vidErr } = await client.storage.from("covers").remove([videoPath]);
            if (vidErr) console.error('[DELETE POST] Error removing video:', vidErr);
            else console.log('[DELETE POST] Video removed successfully');
          } catch (e) {
            console.error('[DELETE POST] Exception removing video:', e);
          }
        } else if (postData.video_url) {
          console.log('[DELETE POST] Video is URL-based (source:', postData.video_source, ') - skipping Storage cleanup');
        }

        // Delete documents
        if (postData.documents && Array.isArray(postData.documents)) {
          for (const doc of postData.documents) {
            if (doc.url && doc.type !== 'link') {
              try {
                const docPath = doc.url.replace(/.*\/covers\//, '');
                console.log('[DELETE POST] Removing document from Storage:', docPath);
                const { error: docErr } = await client.storage.from("covers").remove([docPath]);
                if (docErr) console.error('[DELETE POST] Error removing document:', docErr);
                else console.log('[DELETE POST] Document removed successfully');
              } catch (e) {
                console.error('[DELETE POST] Exception removing document:', e);
              }
            }
          }
        }
      }

      // Delete the DB row
      console.log('[DELETE POST] Deleting DB row for post:', postId);
      const { error } = await client.from("blog_posts").delete().eq("id", postId);
      if (error) {
        console.error('[DELETE POST] DB deletion error:', error);
        throw error;
      }
      console.log('[DELETE POST] Post deleted successfully:', postId);
      loadPosts();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('[DELETE POST] Final error:', errorMessage);
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
      let finalVideoUrl = newsVideoRemoved ? "" : (editingNews?.video_url || "");
      let finalVideoSource: VideoSource | null = newsVideoRemoved ? null : (editingNews?.video_source || null);

      console.log('[VIDEO NEWS FLOW] Initial state:', {
        newsVideoRemoved,
        editingNewsVideoUrl: editingNews?.video_url,
        editingNewsVideoSource: editingNews?.video_source,
        newsVideoUrlInput,
        newsVideoFile: newsVideoFile?.name,
        finalVideoUrl,
        finalVideoSource,
      });

      // Si se pegó un link, usarlo como video
      if (newsVideoUrlInput.trim()) {
        console.log('[VIDEO NEWS FLOW] URL input provided:', newsVideoUrlInput.trim());
        finalVideoUrl = newsVideoUrlInput.trim();
        finalVideoSource = detectVideoSource(newsVideoUrlInput.trim());
        console.log('[VIDEO NEWS FLOW] Detected source:', finalVideoSource);
        if (editingNews?.video_url && editingNews?.video_source === 'upload') {
          try {
            const oldVideoPath = editingNews.video_url.replace(/.*\/covers\//, '');
            console.log('[VIDEO NEWS FLOW] Removing old uploaded video from Storage:', oldVideoPath);
            const { error: removeErr } = await client.storage.from("covers").remove([oldVideoPath]);
            if (removeErr) console.error('[VIDEO NEWS FLOW] Error removing old video:', removeErr);
            else console.log('[VIDEO NEWS FLOW] Old uploaded video removed successfully');
          } catch (e) {
            console.error('[VIDEO NEWS FLOW] Exception removing old video:', e);
          }
        } else {
          console.log('[VIDEO NEWS FLOW] No old uploaded video to clean up');
        }
      } else if (newsVideoFile) {
        console.log('[VIDEO NEWS FLOW] New video file provided:', newsVideoFile.name);
        finalVideoSource = 'upload';
        if (editingNews?.video_url && editingNews?.video_source === 'upload') {
          try {
            const oldVideoPath = editingNews.video_url.replace(/.*\/covers\//, '');
            console.log('[VIDEO NEWS FLOW] Removing old uploaded video from Storage:', oldVideoPath);
            const { error: removeErr } = await client.storage.from("covers").remove([oldVideoPath]);
            if (removeErr) console.error('[VIDEO NEWS FLOW] Error removing old video:', removeErr);
            else console.log('[VIDEO NEWS FLOW] Old uploaded video removed successfully');
          } catch (e) {
            console.error('[VIDEO NEWS FLOW] Exception removing old video:', e);
          }
        } else {
          console.log('[VIDEO NEWS FLOW] No old uploaded video to clean up');
        }
      } else if (newsVideoRemoved) {
        console.log('[VIDEO NEWS FLOW] Video marked for removal');
        if (editingNews?.video_url && editingNews?.video_source === 'upload') {
          try {
            const oldVideoPath = editingNews.video_url.replace(/.*\/covers\//, '');
            console.log('[VIDEO NEWS FLOW] Removing uploaded video from Storage:', oldVideoPath);
            const { error: removeErr } = await client.storage.from("covers").remove([oldVideoPath]);
            if (removeErr) console.error('[VIDEO NEWS FLOW] Error removing video:', removeErr);
            else console.log('[VIDEO NEWS FLOW] Uploaded video removed successfully');
          } catch (e) {
            console.error('[VIDEO NEWS FLOW] Exception removing video:', e);
          }
        } else if (editingNews?.video_url) {
          console.log('[VIDEO NEWS FLOW] Video is URL-based (source:', editingNews.video_source, ') - no Storage cleanup needed');
        } else {
          console.log('[VIDEO NEWS FLOW] No existing video to clean up');
        }
        finalVideoUrl = "";
        finalVideoSource = null;
      } else {
        console.log('[VIDEO NEWS FLOW] No video changes - keeping existing state');
      }

      console.log('[VIDEO NEWS FLOW] Final state:', { finalVideoUrl, finalVideoSource });

      // Eliminar imagen vieja de Storage si se reemplaza
      if (editingNews?.cover_url && newsImageFile) {
        try {
          const oldImagePath = editingNews.cover_url.replace(/.*\/covers\//, '');
          console.log('[IMAGE NEWS FLOW] Removing old cover image from Storage:', oldImagePath);
          const { error: imgErr } = await client.storage.from("covers").remove([oldImagePath]);
          if (imgErr) console.error('[IMAGE NEWS FLOW] Error removing old image:', imgErr);
          else console.log('[IMAGE NEWS FLOW] Old cover image removed successfully');
        } catch (e) {
          console.error('[IMAGE NEWS FLOW] Exception removing old image:', e);
        }
      }

      // Eliminar imagen destacada si el usuario la quitó con el botón ×
      if (newsImageRemoved && editingNews?.cover_url && !newsImageFile) {
        try {
          const oldImagePath = editingNews.cover_url.replace(/.*\/covers\//, '');
          console.log('[COVER SUBMIT NEWS] Removing cover image from Storage:', oldImagePath);
          const { error: imgErr } = await client.storage.from("covers").remove([oldImagePath]);
          if (imgErr) console.error('[COVER SUBMIT NEWS] Error removing cover:', imgErr);
          else console.log('[COVER SUBMIT NEWS] Cover removed successfully');
        } catch (e) {
          console.error('[COVER SUBMIT NEWS] Exception removing cover:', e);
        }
        finalCoverUrl = "";
      }

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

      // 1b. Subir video si existe (modo archivo)
      if (newsVideoFile && finalVideoSource === 'upload') {
        const videoName = `videos/${Date.now()}-${newsVideoFile.name.replace(/\s+/g, '-')}`;
        const { error: videoUploadError } = await client.storage
          .from("covers")
          .upload(videoName, newsVideoFile);
        
        if (videoUploadError) throw new Error("Error subiendo video: " + videoUploadError.message);
        
        const { data: videoData } = client.storage.from("covers").getPublicUrl(videoName);
        finalVideoUrl = videoData.publicUrl;
      }

      // 2. Preparar datos del post (News siempre tiene categoría "Actualidad")
      console.log('[COVER SUBMIT NEWS] Final cover_url to save:', finalCoverUrl, '| newsImageRemoved:', newsImageRemoved, '| newsImageFile:', newsImageFile?.name);
      const postData = {
        title: newsForm.title,
        description: newsForm.description,
        author: newsForm.author,
        category: "Actualidad",
        cover_url: finalCoverUrl,
        video_url: finalVideoUrl,
        video_source: finalVideoSource,
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
      const errorMessage = err instanceof Error ? err.message : (isEs ? 'Error al publicar la news' : 'Error publishing news');
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
    setNewsVideoPreview(post.video_url || null);
    setNewsVideoSource(post.video_source || null);
    setNewsVideoUrlInput(post.video_source === 'upload' || !post.video_url ? '' : (post.video_url || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteNews = async (postId: string) => {
    if (!confirm(isEs ? "¿Estás seguro de que quieres eliminar esta news?" : "Are you sure you want to delete this news?")) return;
    
    try {
      const client = createClient();
      console.log('[DELETE NEWS] Starting deletion for news:', postId);

      // Fetch the news first to get Storage file paths
      const { data: newsData, error: fetchError } = await client
        .from('blog_posts')
        .select('cover_url, video_url, video_source')
        .eq('id', postId)
        .single();

      if (fetchError) {
        console.error('[DELETE NEWS] Error fetching news for cleanup:', fetchError);
      }

      // Clean up Storage files
      if (newsData) {
        if (newsData.cover_url) {
          try {
            const imagePath = newsData.cover_url.replace(/.*\/covers\//, '');
            console.log('[DELETE NEWS] Removing cover image from Storage:', imagePath);
            const { error: imgErr } = await client.storage.from("covers").remove([imagePath]);
            if (imgErr) console.error('[DELETE NEWS] Error removing cover image:', imgErr);
            else console.log('[DELETE NEWS] Cover image removed successfully');
          } catch (e) {
            console.error('[DELETE NEWS] Exception removing cover image:', e);
          }
        }

        if (newsData.video_url && newsData.video_source === 'upload') {
          try {
            const videoPath = newsData.video_url.replace(/.*\/covers\//, '');
            console.log('[DELETE NEWS] Removing uploaded video from Storage:', videoPath);
            const { error: vidErr } = await client.storage.from("covers").remove([videoPath]);
            if (vidErr) console.error('[DELETE NEWS] Error removing video:', vidErr);
            else console.log('[DELETE NEWS] Video removed successfully');
          } catch (e) {
            console.error('[DELETE NEWS] Exception removing video:', e);
          }
        } else if (newsData.video_url) {
          console.log('[DELETE NEWS] Video is URL-based (source:', newsData.video_source, ') - skipping Storage cleanup');
        }
      }

      console.log('[DELETE NEWS] Deleting DB row for news:', postId);
      const { error } = await client.from("blog_posts").delete().eq("id", postId);
      if (error) {
        console.error('[DELETE NEWS] DB deletion error:', error);
        throw error;
      }
      console.log('[DELETE NEWS] News deleted successfully:', postId);
      loadNews();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('[DELETE NEWS] Final error:', errorMessage);
      setErrorMsg(errorMessage);
    }
  };

  return (
     <DashboardAuth>
    <main className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-5xl mx-auto p-4 md:p-12 pt-24 md:pt-28">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Better Editor</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{ui.hiTeam}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => { setActiveTab('create'); resetForm(); }}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'create' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {ui.newPost}
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('news'); resetNewsForm(); }}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'news' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {ui.news}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'manage' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {ui.editPosts}
            </button>
          </div>
        </header>

        {activeTab === 'create' ? (
          <div className="bg-white rounded-[2rem] p-4 md:p-8 shadow-2xl border border-slate-100">
            {editingPost && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl flex justify-between items-center">
                <span className="text-blue-600 text-xs font-black uppercase truncate">{ui.editing}: {editingPost.title}</span>
                <button onClick={resetForm} className="text-slate-400 hover:text-red-500 text-xs font-bold whitespace-nowrap">{ui.cancel}</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.postTitle}</label>
                <input 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all"
                  placeholder="Ej: Reporte de Suministros Abril"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  required
                />
              </div>

              {/* Editor de Texto  */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.content}</label>
                <div className="border-2 border-slate-100 rounded-2xl overflow-hidden bg-white" onClick={handleEditorImageClick}>
                  <ReactQuill 
                    ref={reactQuillRef}
                    theme="snow" 
                    value={form.description} 
                    onChange={(content) => setForm({...form, description: content})} 
                    placeholder={ui.contentPlaceholder}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'background': [] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                  />
                  {/* Inline toolbar extensions: Table + Callout */}
                  <div className="flex items-center gap-1 px-2 pb-1 border border-t-0 border-slate-200 bg-slate-50 rounded-b-xl">
                    <button
                      type="button"
                      onClick={() => {
                        const editor = reactQuillRef.current?.getEditor();
                        if (editor) {
                          registerQuillExtensions(editor);
                          insertTable(editor, 3, 3);
                          syncEditorContent();
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold uppercase rounded bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer"
                      title={isEs ? "Insertar tabla" : "Insert table"}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                      {isEs ? "Tabla" : "Table"}
                    </button>
                    <button type="button" onClick={() => { const e = reactQuillRef.current?.getEditor(); if (e) { addTableRow(e); syncEditorContent(); } }}
                      className="inline-flex items-center px-1.5 py-1 text-[11px] font-bold rounded bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer" title={isEs ? "Agregar fila" : "Add row"}>
                      +{isEs ? "Fila" : "Row"}
                    </button>
                    <button type="button" onClick={() => { const e = reactQuillRef.current?.getEditor(); if (e) { removeTableRow(e); syncEditorContent(); } }}
                      className="inline-flex items-center px-1.5 py-1 text-[11px] font-bold rounded bg-white border border-slate-200 hover:border-red-400 hover:text-red-600 transition-all cursor-pointer" title={isEs ? "Eliminar fila" : "Remove row"}>
                      &minus;{isEs ? "Fila" : "Row"}
                    </button>
                    <button type="button" onClick={() => { const e = reactQuillRef.current?.getEditor(); if (e) { addTableColumn(e); syncEditorContent(); } }}
                      className="inline-flex items-center px-1.5 py-1 text-[11px] font-bold rounded bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer" title={isEs ? "Agregar columna" : "Add column"}>
                      +{isEs ? "Col" : "Col"}
                    </button>
                    <button type="button" onClick={() => { const e = reactQuillRef.current?.getEditor(); if (e) { removeTableColumn(e); syncEditorContent(); } }}
                      className="inline-flex items-center px-1.5 py-1 text-[11px] font-bold rounded bg-white border border-slate-200 hover:border-red-400 hover:text-red-600 transition-all cursor-pointer" title={isEs ? "Eliminar columna" : "Remove column"}>
                      &minus;{isEs ? "Col" : "Col"}
                    </button>
                  </div>
                </div>
                {/* Image width selector */}
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    {isEs ? "Ajustar ancho:" : "Adjust width:"}
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="100"
                    step="25"
                    defaultValue="100"
                    onChange={(e) => {
                      const editor = reactQuillRef.current?.getEditor();
                      if (editor && selectedImageRef.current) {
                        const imageIndex = findImageIndex(editor, selectedImageRef.current);
                        if (imageIndex != null) {
                          applyImageWidthAtIndex(editor, imageIndex, `${e.target.value}%`);
                        }
                      }
                    }}
                    className="accent-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const editor = reactQuillRef.current?.getEditor();
                      if (editor && selectedImageRef.current) {
                        const imageIndex = findImageIndex(editor, selectedImageRef.current);
                        if (imageIndex != null) {
                          applyImageWidthAtIndex(editor, imageIndex, "100%");
                        }
                      }
                    }}
                    className="px-3 py-1.5 text-[11px] font-bold uppercase rounded-lg border border-slate-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all"
                  >
                    {isEs ? "Reset" : "Reset"}
                  </button>
                  <button
                    type="button"
                    onMouseDown={captureImageSelection}
                    onClick={() => {
                      const editor = reactQuillRef.current?.getEditor();
                      if (editor) {
                        const deleted = deleteImageAtIndex(editor, null, selectedImageRef.current);
                        if (deleted) {
                          selectedImageRef.current = null;
                          syncEditorContent();
                        }
                      }
                    }}
                    className="px-3 py-1.5 text-[11px] font-bold uppercase rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                    title={isEs ? "Eliminar imagen seleccionada" : "Delete selected image"}
                  >
                    {isEs ? "Eliminar imagen" : "Delete image"}
                  </button>
                </div>
              </div>

              {/* URL externa opcional */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.externalUrl}</label>
                <input 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all"
                  placeholder="https://ejemplo.com (opcional)"
                  value={form.post_url}
                  onChange={(e) => setForm({...form, post_url: e.target.value})}
                />
              </div>

              {/* Subida de Imagen */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.featuredImage}</label>
                <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center ${preview ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}`}>
                  {preview ? (
                    <div className="relative w-full h-48 mb-4">
                      <img src={preview} className="w-full h-full object-contain rounded-lg" alt="Preview" />
                      <button type="button" onClick={() => {
                        console.log('[COVER REMOVE] click, current state:', {imageFile, preview, editingPostCover: editingPost?.cover_url});
                        if (editingPost?.cover_url) {
                          setImageRemoved(true);
                        }
                        setPreview(null);
                        setImageFile(null);
                        console.log('[COVER REMOVE] state cleared, imageRemoved:', editingPost?.cover_url ? true : false);
                      }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">×</button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📊</span>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">{ui.dragImage}</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
                        setImageFile(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                    className={`absolute inset-0 opacity-0 cursor-pointer ${preview ? 'pointer-events-none' : ''}`}
                  />
                  {preview && (
                    <label className="mt-2 text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                      {isEs ? "Cambiar imagen" : "Change image"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
                          setImageFile(file);
                          setPreview(URL.createObjectURL(file));
                        }
                      }} />
                    </label>
                  )}
                </div>
              </div>

              {/* Video (link o archivo) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  {isEs ? "Video (pegá un link de YouTube/Vimeo o subí un archivo)" : "Video (paste a YouTube/Vimeo link or upload a file)"}
                </label>

                {/* Input de URL con botón de eliminar */}
                <div className="relative">
                  <input
                    type="url"
                    className="w-full px-5 py-4 pr-12 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all"
                    placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
                    value={videoUrlInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setVideoUrlInput(val);
                      if (val.trim()) {
                        setVideoFile(null);
                        setVideoPreview(null);
                        setVideoRemoved(false);
                        const src = detectVideoSource(val);
                        setVideoSource(src);
                      } else {
                        setVideoSource(null);
                        if (editingPost?.video_url) {
                          setVideoRemoved(true);
                          console.log('[VIDEO] URL input cleared - marking video for removal');
                        }
                      }
                    }}
                  />
                  {videoUrlInput.trim() && videoSource && videoSource !== 'upload' && (
                    <button
                      type="button"
                      onClick={() => {
                        console.log('[VIDEO] Removing URL video:', videoUrlInput);
                        setVideoUrlInput('');
                        setVideoSource(null);
                        if (editingPost?.video_url) {
                          setVideoRemoved(true);
                        }
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold hover:bg-red-600 transition-all"
                      title={isEs ? "Eliminar video" : "Remove video"}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-[10px] font-black uppercase text-slate-300">{isEs ? "o" : "or"}</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                {/* Zona de archivo */}
                <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center ${videoPreview && videoSource === 'upload' ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}`}>
                  {videoPreview && videoSource === 'upload' ? (
                    <div className="relative w-full mb-4">
                      <video src={videoPreview} controls className="w-full h-48 object-contain rounded-lg" />
                      <button type="button" onClick={() => { setVideoPreview(null); setVideoFile(null); setVideoRemoved(true); setVideoSource(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">×</button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <span className="text-3xl mb-1 block">🎬</span>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">{ui.dragVideo}</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 50 * 1024 * 1024) {
                          setErrorMsg(isEs ? 'El video supera el límite de 50MB.' : 'Video exceeds the 50MB limit.');
                          return;
                        }
                        if (videoPreview?.startsWith('blob:')) URL.revokeObjectURL(videoPreview);
                        setVideoFile(file);
                        setVideoPreview(URL.createObjectURL(file));
                        setVideoRemoved(false);
                        setVideoUrlInput('');
                        setVideoSource('upload');
                      }
                    }}
                    className={`absolute inset-0 opacity-0 cursor-pointer ${videoPreview && videoSource === 'upload' ? 'pointer-events-none' : ''}`}
                  />
                  {videoPreview && videoSource === 'upload' && (
                    <label className="mt-2 text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                      {isEs ? "Cambiar video" : "Change video"}
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 50 * 1024 * 1024) {
                            setErrorMsg(isEs ? 'El video supera el límite de 50MB.' : 'Video exceeds the 50MB limit.');
                            return;
                          }
                          if (videoPreview?.startsWith('blob:')) URL.revokeObjectURL(videoPreview);
                          setVideoFile(file);
                          setVideoPreview(URL.createObjectURL(file));
                          setVideoRemoved(false);
                          setVideoUrlInput('');
                          setVideoSource('upload');
                        }
                      }} />
                    </label>
                  )}
                </div>

                {/* Preview de video embebido (YouTube/Vimeo) */}
                {videoUrlInput.trim() && videoSource && videoSource !== 'upload' && (
                  <div className="mt-2">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">
                      {isEs ? "Vista previa:" : "Preview:"}
                    </p>
                    <VideoPlayer videoUrl={videoUrlInput.trim()} videoSource={videoSource} />
                  </div>
                )}
              </div>

              {/* Links Opcionales */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.linksOptional}</label>
                  <button type="button" onClick={handleAddLink} className="text-blue-600 text-[10px] font-black uppercase hover:underline">
                    {ui.addLink}
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
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.documentsOptional}</label>
                  <button type="button" onClick={handleAddDocument} className="text-blue-600 text-[10px] font-black uppercase hover:underline">
                    {ui.addDocument}
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
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.author}</label>
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
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.category}</label>
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
                {loading ? (editingPost ? ui.updating : ui.publishing) : (editingPost ? ui.updatePost : ui.publishNow)}
              </button>

              {/* Preview del contenido */}
              {form.description && (
                <div className="space-y-2 mt-8">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.preview}</label>
                  <div className="border-2 border-slate-100 rounded-2xl p-6 bg-slate-50">
                    <div 
                      className="prose prose-slate max-w-none text-slate-700 text-sm
                        [&>p]:mb-4 [&>img]:my-4 [&>img]:rounded-xl [&>img]:max-w-full [&>img]:h-auto
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

              {success && <div className="p-4 bg-green-50 text-green-600 rounded-xl text-center text-xs font-black uppercase tracking-widest animate-bounce">✓ {editingPost ? ui.successPost : ui.successPostCreate} en Better Blog</div>}
              {errorMsg && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-xs font-bold">{errorMsg}</div>}
            </form>
          </div>
        ) : activeTab === 'news' ? (
          /* Formulario de News */
          <div className="bg-white rounded-[2rem] p-4 md:p-8 shadow-2xl border border-slate-100">
            {editingNews && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl flex justify-between items-center">
                <span className="text-blue-600 text-xs font-black uppercase">{ui.editing}: {editingNews.title}</span>
                <button onClick={resetNewsForm} className="text-slate-400 hover:text-red-500 text-xs font-bold">{ui.cancel}</button>
              </div>
            )}

            <form onSubmit={handleNewsSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.newsTitle}</label>
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
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.description}</label>
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
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.sourceUrl}</label>
                <input 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all"
                  placeholder="https://ejemplo.com (opcional)"
                  value={newsForm.post_url}
                  onChange={(e) => setNewsForm({...newsForm, post_url: e.target.value})}
                />
              </div>

              {/* Subida de Imagen */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.featuredImage}</label>
                <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center ${newsPreview ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}`}>
                  {newsPreview ? (
                    <div className="relative w-full h-48 mb-4">
                      <img src={newsPreview} className="w-full h-full object-contain rounded-lg" alt="Preview" />
                      <button type="button" onClick={() => {
                        console.log('[COVER REMOVE NEWS] click, current state:', {newsImageFile, newsPreview, editingNewsCover: editingNews?.cover_url});
                        if (editingNews?.cover_url) {
                          setNewsImageRemoved(true);
                        }
                        setNewsPreview(null);
                        setNewsImageFile(null);
                        console.log('[COVER REMOVE NEWS] state cleared, newsImageRemoved:', editingNews?.cover_url ? true : false);
                      }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">×</button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📰</span>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">{ui.dragImage}</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (newsPreview?.startsWith('blob:')) URL.revokeObjectURL(newsPreview);
                        setNewsImageFile(file);
                        setNewsPreview(URL.createObjectURL(file));
                      }
                    }}
                    className={`absolute inset-0 opacity-0 cursor-pointer ${newsPreview ? 'pointer-events-none' : ''}`}
                  />
                  {newsPreview && (
                    <label className="mt-2 text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                      {isEs ? "Cambiar imagen" : "Change image"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (newsPreview?.startsWith('blob:')) URL.revokeObjectURL(newsPreview);
                          setNewsImageFile(file);
                          setNewsPreview(URL.createObjectURL(file));
                        }
                      }} />
                    </label>
                  )}
                </div>
              </div>

              {/* Video (link o archivo) - News */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  {isEs ? "Video (pegá un link de YouTube/Vimeo o subí un archivo)" : "Video (paste a YouTube/Vimeo link or upload a file)"}
                </label>

                <div className="relative">
                <input
                  type="url"
                  className="w-full px-5 py-4 pr-12 rounded-2xl border-2 border-slate-100 font-bold focus:border-blue-600 outline-none transition-all"
                  placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
                  value={newsVideoUrlInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewsVideoUrlInput(val);
                    if (val.trim()) {
                      setNewsVideoFile(null);
                      setNewsVideoPreview(null);
                      setNewsVideoRemoved(false);
                      const src = detectVideoSource(val);
                      setNewsVideoSource(src);
                    } else {
                      setNewsVideoSource(null);
                      if (editingNews?.video_url) {
                        setNewsVideoRemoved(true);
                        console.log('[VIDEO NEWS] URL input cleared - marking video for removal');
                      }
                    }
                  }}
                />
                {newsVideoUrlInput.trim() && newsVideoSource && newsVideoSource !== 'upload' && (
                  <button
                    type="button"
                    onClick={() => {
                      console.log('[VIDEO NEWS] Removing URL video:', newsVideoUrlInput);
                      setNewsVideoUrlInput('');
                      setNewsVideoSource(null);
                      if (editingNews?.video_url) {
                        setNewsVideoRemoved(true);
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold hover:bg-red-600 transition-all"
                    title={isEs ? "Eliminar video" : "Remove video"}
                  >
                    ×
                  </button>
                )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-[10px] font-black uppercase text-slate-300">{isEs ? "o" : "or"}</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center ${newsVideoPreview && newsVideoSource === 'upload' ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}`}>
                  {newsVideoPreview && newsVideoSource === 'upload' ? (
                    <div className="relative w-full mb-4">
                      <video src={newsVideoPreview} controls className="w-full h-48 object-contain rounded-lg" />
                      <button type="button" onClick={() => { setNewsVideoPreview(null); setNewsVideoFile(null); setNewsVideoRemoved(true); setNewsVideoSource(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">×</button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <span className="text-3xl mb-1 block">🎬</span>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">{ui.dragVideo}</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 50 * 1024 * 1024) {
                          setErrorMsg(isEs ? 'El video supera el límite de 50MB.' : 'Video exceeds the 50MB limit.');
                          return;
                        }
                        if (newsVideoPreview?.startsWith('blob:')) URL.revokeObjectURL(newsVideoPreview);
                        setNewsVideoFile(file);
                        setNewsVideoPreview(URL.createObjectURL(file));
                        setNewsVideoRemoved(false);
                        setNewsVideoUrlInput('');
                        setNewsVideoSource('upload');
                      }
                    }}
                    className={`absolute inset-0 opacity-0 cursor-pointer ${newsVideoPreview && newsVideoSource === 'upload' ? 'pointer-events-none' : ''}`}
                  />
                  {newsVideoPreview && newsVideoSource === 'upload' && (
                    <label className="mt-2 text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                      {isEs ? "Cambiar video" : "Change video"}
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 50 * 1024 * 1024) {
                            setErrorMsg(isEs ? 'El video supera el límite de 50MB.' : 'Video exceeds the 50MB limit.');
                            return;
                          }
                          if (newsVideoPreview?.startsWith('blob:')) URL.revokeObjectURL(newsVideoPreview);
                          setNewsVideoFile(file);
                          setNewsVideoPreview(URL.createObjectURL(file));
                          setNewsVideoRemoved(false);
                          setNewsVideoUrlInput('');
                          setNewsVideoSource('upload');
                        }
                      }} />
                    </label>
                  )}
                </div>

                {newsVideoUrlInput.trim() && newsVideoSource && newsVideoSource !== 'upload' && (
                  <div className="mt-2">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">
                      {isEs ? "Vista previa:" : "Preview:"}
                    </p>
                    <VideoPlayer videoUrl={newsVideoUrlInput.trim()} videoSource={newsVideoSource} />
                  </div>
                )}
              </div>

              {/* Autor */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.author}</label>
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
                {loadingNews ? (editingNews ? ui.updating : ui.publishing) : (editingNews ? ui.updateNews : ui.publishNewsNow)}
              </button>

              {/* Preview del contenido */}
              {newsForm.description && (
                <div className="space-y-2 mt-8">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ui.preview}</label>
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
              <h2 className="text-lg md:text-xl font-black uppercase text-slate-900 mb-4 md:mb-6">{ui.existingNews}</h2>
              
              {loadingNews ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : newsPosts.length === 0 ? (
                <p className="text-slate-400 text-center py-8">{ui.noNewsYet}</p>
              ) : (
                <div className="space-y-4">
                  {newsPosts.map((post) => (
                    <div key={post.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-all">
                      <div className="w-full sm:w-16 h-16 relative rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        {post.cover_url ? (
                          <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">{ui.noImg}</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <h3 className="font-black text-sm text-slate-900 truncate">{post.title}</h3>
                        <p className="text-[10px] text-slate-400 uppercase">{post.category} · {new Date(post.published_at).toLocaleDateString()} {post.video_url && '· ▶ Video'}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handleEditNews(post)}
                          className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full hover:bg-blue-700 transition-all"
                        >
                          {ui.edit}
                        </button>
                        <button 
                          onClick={() => handleDeleteNews(post.id)}
                          className="flex-1 sm:flex-none px-3 py-2 bg-red-50 text-red-500 text-[10px] font-black uppercase rounded-full hover:bg-red-100 transition-all"
                        >
                          {ui.delete}
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
            <h2 className="text-lg md:text-xl font-black uppercase text-slate-900 mb-4 md:mb-6">{ui.existingPosts}</h2>
            
            {loadingPosts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : posts.length === 0 ? (
              <p className="text-slate-400 text-center py-8">{ui.noPostsYet}</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-all">
                    <div className="w-full sm:w-16 h-16 relative rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {post.cover_url ? (
                        <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">{ui.noImg}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <h3 className="font-black text-sm text-slate-900 truncate">{post.title}</h3>
                      <p className="text-[10px] text-slate-400 uppercase">{post.category} · {new Date(post.published_at).toLocaleDateString()} {post.video_url && '· ▶ Video'}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleEdit(post)}
                        className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full hover:bg-blue-700 transition-all"
                      >
                        {ui.edit}
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="flex-1 sm:flex-none px-3 py-2 bg-red-50 text-red-500 text-[10px] font-black uppercase rounded-full hover:bg-red-100 transition-all"
                      >
                        {ui.delete}
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
    </DashboardAuth>
  );
}