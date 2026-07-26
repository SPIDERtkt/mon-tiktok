import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === correctPassword) {
      // On garde une petite trace dans le navigateur pour rester connecté
      window.sessionStorage.setItem('is_admin', 'true');
      router.push('/admin/upload');
    } else {
      setError('Mot de passe incorrect');
    }
  }

  return (
    <div className="admin-container">
      <h2>Connexion admin</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Mot de passe admin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Se connecter</button>
        {error && <p className="message">{error}</p>}
      </form>
    </div>
  );
}
