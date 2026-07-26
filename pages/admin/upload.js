import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function Upload() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Protection basique : redirige si pas connecté
  useEffect(() => {
    const isAdmin = window.sessionStorage.getItem('is_admin');
    if (isAdmin !== 'true') {
      router.push('/login');
    }
  }, [router]);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      setMessage('Choisis un fichier vidéo.');
      return;
    }

    setUploading(true);
    setMessage('Envoi en cours...');

    // 1. Upload du fichier dans le bucket "videos"
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, file);

    if (uploadError) {
      setMessage("Erreur d'upload : " + uploadError.message);
      setUploading(false);
      return;
    }

    // 2. Récupération de l'URL publique du fichier
    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    const videoUrl = publicUrlData.publicUrl;

    // 3. Enregistrement des infos dans la table "videos"
    const { error: insertError } = await supabase.from('videos').insert({
      title,
      description,
      video_url: videoUrl,
      likes: 0,
    });

    if (insertError) {
      setMessage("Erreur d'enregistrement : " + insertError.message);
    } else {
      setMessage('Vidéo publiée avec succès !');
      setTitle('');
      setDescription('');
      setFile(null);
      e.target.reset();
    }

    setUploading(false);
  }

  return (
    <div className="admin-container">
      <h2>Ajouter une vidéo</h2>
      <form className="admin-form" onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Envoi...' : 'Publier'}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
