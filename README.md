DocFinder
DocFinder est une application de bureau simple conçue pour scanner, organiser et gérer vos documents PDF localement. Développé dans le cadre de mon projet PreTPI, cet outil combine un backend PHP et une interface React, le tout encapsulé dans l'environnement Electron.

Fonctionnalités
Scanner de répertoires : Sélectionnez n'importe quel dossier sur votre ordinateur pour identifier instantanément tous les fichiers PDF qu'il contient.

Bibliothèque persistante : Ajoutez vos documents importants à une bibliothèque dédiée. Vos choix sont sauvegardés localement et conservés même après la fermeture de l'application.

Recherche en temps réel : Filtrez vos fichiers par nom grâce à une barre de recherche, que ce soit dans les résultats du scan ou dans votre bibliothèque.

Consultation de documents : Ouvrez vos fichiers PDF directement dans le lecteur par défaut de votre système d'exploitation avec un simple clic.

Architecture Technique
Le projet repose sur une architecture hybride :

Frontend : React + Vite pour une interface réactive et rapide.

Application Desktop : Electron gère les fenêtres natives et la communication sécurisée (IPC).

Backend de Scan : PHP utilisé pour les opérations sur le système de fichiers (scandir, filtrage d'extensions).

Styles : Tailwind CSS pour un design utilitaire et responsive.

Stockage : electron-store pour la persistance des données au format JSON.

Installation
Prérequis
Node.js (v22.18.0)

PHP (v8.5.2 ; installé et ajouté à votre variable d'environnement PATH)

Étapes
Cloner le dépôt

Bash
git clone https://github.com/KT539/DocFinder.git
cd DocFinder
Installer les dépendances Node.js

Bash
npm install
Lancer l'application

Bash
npm start
Cette commande lance simultanément le serveur de développement Vite et l'instance Electron.

Structure du Projet
Plaintext
├── backend/            # Scripts PHP (logique de scan)
├── electron/           # Main process, Preload et configuration Electron
├── src/                # Code source React (Pages, Styles, Components)
│   ├── pages/          # Home, Scanner, Library
│   ├── App.jsx         # Navigation interne
│   ├── main.jsx        # Point d'entrée React
│   └── styles.css      # Configuration Tailwind
├── index.html          # Point d'entrée HTML
└── package.json        # Dépendances et scripts
Détails du Développement
Sécurité (Bridge IPC)
L'application utilise un script preload.js pour exposer de manière sécurisée les fonctionnalités système au rendu React via contextBridge. Cela évite d'exposer directement le module nodeIntegration dans le navigateur.

Serveur PHP Intégré
Au lancement, Electron instancie un serveur PHP local sur le port 8000 via un child_process. Ce serveur agit comme une API locale traitant les requêtes de scan de dossiers envoyées par le frontend.

Auteur
Kilian Testard - Développeur principal

Pascal Hurni - Responsable de projet
