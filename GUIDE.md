# Guide de mise en ligne — Mon TikTok-like

Suis ces étapes DANS L'ORDRE. Ça prend environ 20-30 minutes la première fois.

---

## ÉTAPE 1 — Créer le projet Supabase (stockage + base de données)

1. Va sur https://supabase.com et crée un compte gratuit.
2. Clique sur **"New project"**.
3. Donne un nom, choisis un mot de passe pour la base (note-le), choisis une région proche (Europe).
4. Attends 1-2 minutes que le projet se crée.

### 1.1 — Créer la table des vidéos

Dans le menu de gauche, clique sur **"SQL Editor"** > **"New query"**, colle ce code, puis clique sur **"Run"** :

```sql
create table videos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  video_url text not null,
  likes integer default 0,
  created_at timestamp with time zone default now()
);

-- Autorise tout le monde à LIRE les vidéos (le feed public)
alter table videos enable row level security;

create policy "Lecture publique des vidéos"
on videos for select
using (true);

-- Autorise tout le monde à AJOUTER / MODIFIER (on protège via le mot de passe admin côté site)
create policy "Insertion publique"
on videos for insert
with check (true);

create policy "Mise à jour publique (likes)"
on videos for update
using (true);
```

### 1.2 — Créer le bucket de stockage vidéo

1. Dans le menu de gauche, clique sur **"Storage"**.
2. Clique **"New bucket"**, nomme-le exactement : `videos`
3. Active l'option **"Public bucket"** (pour que les vidéos soient visibles sans connexion).
4. Clique **"Create bucket"**.

### 1.3 — Récupérer tes clés API

1. Menu de gauche > **"Project Settings"** > **"API"**.
2. Note deux valeurs : **Project URL** et **anon public key**.

---

## ÉTAPE 2 — Configurer le code

1. Ouvre le fichier `.env.local.example`, renomme-le en `.env.local`.
2. Remplis les 3 valeurs :
   - `NEXT_PUBLIC_SUPABASE_URL` → ton Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → ta clé anon
   - `NEXT_PUBLIC_ADMIN_PASSWORD` → un mot de passe que TOI seul connaîtras (ex: MonSiteSecret2026)

⚠️ Ce mot de passe protège l'accès à la page d'upload, mais reste basique (pas un vrai système de comptes). Suffisant pour démarrer seul ; on pourra le renforcer plus tard avec un vrai système de connexion Supabase si besoin.

---

## ÉTAPE 3 — Mettre le code sur GitHub

1. Crée un compte sur https://github.com si tu n'en as pas.
2. Crée un nouveau repository (bouton vert **"New"**), nomme-le par ex. `mon-tiktok`.
3. Sur ta machine, dans le dossier du projet, exécute :

```bash
git init
git add .
git commit -m "Premier envoi"
git branch -M main
git remote add origin https://github.com/TON-NOM-UTILISATEUR/mon-tiktok.git
git push -u origin main
```

(Remplace `TON-NOM-UTILISATEUR` par ton pseudo GitHub réel.)

**Important** : ne mets JAMAIS le fichier `.env.local` sur GitHub (il contient tes clés). Un fichier `.gitignore` est déjà inclus dans le projet pour l'exclure automatiquement.

---

## ÉTAPE 4 — Déployer sur Netlify

1. Va sur https://netlify.com et connecte-toi avec ton compte GitHub.
2. Clique **"Add new site"** > **"Import an existing project"**.
3. Choisis GitHub, puis sélectionne ton repository `mon-tiktok`.
4. Netlify détecte automatiquement Next.js. Laisse les réglages par défaut.
5. Avant de cliquer sur "Deploy", va dans **"Environment variables"** et ajoute les 3 mêmes variables que dans ton `.env.local` (URL, clé, mot de passe).
6. Clique **"Deploy site"**.

Après 2-3 minutes, ton site est en ligne avec une URL du type `https://ton-site.netlify.app`.

---

## ÉTAPE 5 — Utiliser ton site

- Site public (le feed) : `https://ton-site.netlify.app`
- Accès admin : `https://ton-site.netlify.app/login` → entre ton mot de passe admin → tu arrives sur la page d'upload.

---

## Pour aller plus loin (plus tard)

- Remplacer le mot de passe simple par un vrai compte admin (Supabase Auth).
- Ajouter des commentaires, un système d'abonnés, une recherche.
- Limiter la taille des vidéos uploadées côté Supabase (Storage > Policies).

Si tu bloques à une étape précise, dis-moi exactement où et le message d'erreur affiché.
