# 📄 DocFinder

**DocFinder** est une application de bureau simple conçue pour scanner, organiser et gérer vos documents PDF localement.  

Développé dans le cadre de mon projet de **PréTPI**, cet outil combine un backend PHP et une interface React, le tout encapsulé dans un environnement Electron.

---

## Fonctionnalités

#### Scanner de répertoires
Sélectionnez n'importe quel dossier sur votre ordinateur pour identifier instantanément tous les fichiers PDF qu'il contient.

#### Bibliothèque persistante
Ajoutez vos documents importants à une bibliothèque dédiée.  
Vos choix sont sauvegardés localement et conservés même après la fermeture de l'application.

#### Recherche en temps réel
Filtrez vos fichiers par nom grâce à une barre de recherche, que ce soit dans les résultats du scan ou dans votre bibliothèque.

#### Consultation de documents
Ouvrez vos fichiers PDF directement dans le lecteur par défaut de votre système d'exploitation en un clic.

---

## Architecture Technique

Le projet repose sur une architecture hybride :

- **Frontend** : React + Vite (interface rapide et réactive)
- **Application Desktop** : Electron (gestion des fenêtres et communication IPC)
- **Backend de scan** : PHP (scandir, filtrage des extensions)
- **Styles** : Tailwind CSS (design utilitaire et responsive)
- **Stockage** : electron-store (persistance des données en JSON)

---

## Installation

#### Prérequis

- Node.js (v22.18.0)
- PHP (v8.5.2)

  Assurez-vous que Node.js et PHP soient installés et ajoutés aux variables d'environnement `PATH`

#### Étapes

#### 1. Cloner le dépôt
git clone https://github.com/KT539/DocFinder.git

cd DocFinder

#### 2. Installer les dépendances
npm install

#### 3. Lancer l'application
npm start

Cette commande lance simultanément le serveur de développement Vite et l'application Electron.

---

## Structure du projet
├── backend/        # Scripts PHP (logique de scan)

├── electron/       # Main process, preload et config Electron

├── src/            # Code source React

│   ├── pages/      # Home, Scanner, Library

│   ├── App.jsx     # Navigation

│   ├── main.jsx    # Point d'entrée React

│   └── styles.css  # import Tailwind

├── index.html      # Point d'entrée HTML

└── package.json    # Dépendances et scripts de lancement

---

## Détails du développement
#### Sécurité (Bridge IPC)

L'application utilise un script preload.js pour exposer de manière sécurisée les fonctionnalités système au frontend React via contextBridge.
Cela évite d'exposer directement nodeIntegration dans le navigateur.

#### Serveur PHP intégré

Au lancement, Electron instancie un serveur PHP local sur le port 8000 via un child_process.
Ce serveur agit comme une API locale traitant les requêtes de scan de dossiers envoyées par le frontend.

---

## Auteur
Kilian Testard — Développeur principal

Pascal Hurni — Responsable de projet
