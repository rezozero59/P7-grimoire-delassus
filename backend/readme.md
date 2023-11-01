# Backend "Mon vieux grimoire"

## Pré-requis

Node.js, npm.

## Lien vers le frontend

127.0.0.1:3000

## Lien vers le backend

127.0.0.1:4000

## Installation et lancement du serveur

git clone https://github.com/rezozero59/P7-grimoire-delassus.git

npm install

npm start / nodemon server

## Accès à la base de données

Pour accéder à la base de données, il faut créer un fichier .env à la racine du dossier backend et y ajouter les informations suivantes :

MONGODB_URL=mongodb+srv://<username>:<password>@grimoire.cafkgzn.mongodb.net/?retryWrites=true&w=majority

Pour le test, vous pouvez utiliser les identifiants suivants :
<username>=oc-user-test
<password>=JOpGvOP7KlGdWXTB

Un exemple pour la clé secrète que lors de la signature du token

<JWT_SECRET_KEY> = Shqs433jd25d!qs@jd
