import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setVideos(data);
    setLoading(false);
  }

  async function handleLike(video) {
    const newLikes = (video.likes || 0) + 1;

    // Mise à jour immédiate à l'écran
    setVideos((prev) =>
      prev.map((v) => (v.id === video.id ? { ...v, likes: newLikes } : v))
    );

    // Mise à jour en base
    await supabase.from('videos').update({ likes: newLikes }).eq('id', video.id);
  }

  if (loading) {
    return (
      <div className="empty-state">
        <p>Chargement...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="empty-state">
        <h2>Aucune vidéo pour le moment</h2>
        <p>Connecte-toi en admin pour en ajouter une.</p>
        <Link href="/login" style={{ color: '#fe2c55' }}>
          Accéder à l'admin
        </Link>
      </div>
    );
  }

  return (
    <div className="feed">
      <div className="top-bar">
        <Link href="/login">Admin</Link>
      </div>

      {videos.map((video) => (
        <div className="video-slide" key={video.id}>
          <video src={video.video_url} loop muted autoPlay playsInline />

          <div className="overlay">
            <h3>{video.title}</h3>
            <p>{video.description}</p>
          </div>

          <div className="side-actions">
            <button className="like-btn" onClick={() => handleLike(video)}>
              ❤️
            </button>
            <span className="like-count">{video.likes || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
