# smartcampus

## Authentification API

L'API utilise PostgreSQL et crée automatiquement la table `users` au démarrage.
Les mots de passe sont stockés sous forme hachée. Le compte est verrouillé après
trois tentatives de connexion incorrectes.

Avant le premier démarrage, créez un fichier `.env` à partir de `.env.example`
et renseignez des mots de passe locaux. Construisez ensuite l'application et
démarrez les conteneurs :

```powershell
mvn clean package
docker compose up --build -d
```

Les routes sont accessibles à l'adresse `http://localhost:8082`.
L'interface Swagger UI est disponible à `http://localhost:8082/swagger-ui/index.html`
et la spécification OpenAPI JSON à `http://localhost:8082/v3/api-docs`.

Créer un compte :

```http
POST /api/auth/register
Content-Type: application/json

{"email":"user@example.com","password":"password123"}
```

Se connecter :

```http
POST /api/auth/login
Content-Type: application/json

{"email":"user@example.com","password":"password123"}
```

La connexion répond `200` en cas de succès et `401` si les identifiants sont
incorrects ou si le compte est verrouillé. L'API ne génère pas encore de jeton
ni de session. Pour déverrouiller un compte, réinitialisez son compteur dans
PostgreSQL :

```sql
UPDATE users
SET locked = FALSE, failed_login_attempts = 0
WHERE email = 'user@example.com';
```

## Déploiement Kubernetes (Minikube)

Le manifeste utilise l'image locale `smartcampus:2.1`. Après avoir placé le JAR
dans `target`, construisez et chargez l'image dans Minikube, puis déployez-la :

```powershell
docker build -t smartcampus:2.1 .
minikube image load smartcampus:2.1
kubectl apply -f k8s/deployment.yaml
kubectl rollout status deployment/smartcampus
```

Pour ouvrir Swagger UI depuis la machine locale, démarrez le transfert de port
et laissez cette commande active :

```powershell
kubectl port-forward service/smartcampus 8083:80
```

Ouvrez ensuite `http://localhost:8083/swagger-ui/index.html`.