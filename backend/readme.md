# Backend "Mon vieux grimoire"

## Pré-requis

Node.js, npm.

## Lien vers le frontend

127.0.0.1:3000

## Lien vers le backend

127.0.0.1:4000

## Installation et lancement du serveur

1. Clonez le dépôt:
   git clone https://github.com/rezozero59/P7-grimoire-delassus.git

2. Installez les dépendances :
   npm install

3. Lancez le serveur :
   npm start / nodemon server

## Accès à la base de données

Pour accéder à la base de données, il faut créer un fichier .env à la racine du dossier backend et y ajouter les informations suivantes :

MONGODB_URL=mongodb+srv://<username>:<password>@grimoire.cafkgzn.mongodb.net/?retryWrites=true&w=majority

Pour le test, vous pouvez utiliser les identifiants fournis par email.
Les détails pour accéder à la base de données et d'autres informations sensibles seront fournis séparément pour des raisons de sécurité.

Un exemple pour la clé secrète lors de la signature du token:

<JWT_SECRET_KEY> = Shqs433jd25d!qs@jd

Remarque : Ne partagez jamais vos identifiants de base de données et vos clés secrètes publiquement.
