# Clash Royale Best Decks

## Description

Ce projet est une application web permettant aux utilisateurs de consulter les meilleurs decks pour le jeu Clash Royale. L'application utilise une API Express.js pour récupérer les données sur les decks à partir d'une base de données MongoDB. Les utilisateurs peuvent filtrer les résultats par granularité (semaine ou mois), nombre de résultats à afficher, et type de filtrage.

## Fonctionnalités

- Récupération des meilleurs decks selon la granularité sélectionnée (semaine, mois ou toutes).
- Filtrage des résultats selon différents critères : Victoires, Utilisations, Différence moyenne des decks, et Nombre de joueurs distincts.
- Interface utilisateur dynamique avec React pour afficher les cartes et statistiques des decks.
- Possibilité de réinitialiser les filtres pour afficher tous les résultats.

## Technologies

- **Backend** : Node.js, Express.js, MongoDB
- **Frontend** : React.js
- **Gestion des requêtes HTTP** : Axios
- **CORS** pour permettre les requêtes entre le client et le serveur

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <url-du-repo>
   cd <nom-du-repo>

2. Installez les dépendances :
    ```bash
    npm install
3. Lancez le serveur :
    ```bash
    node server.js
4. Démarrez l'application React :
    ```bash
    npm start

## Utilisation

1. Accédez à l'application à l'adresse http://localhost:3000.
2. Utilisez les sélecteurs pour filtrer les decks en fonction de vos critères.
3. Cliquez sur un deck pour afficher plus de détails sur les cartes qu'il contient.

## Auteur
- [https://www.linkedin.com/in/mohamed-bahloul-b55b13162/](Mohamed BAHLOUL)