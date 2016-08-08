# Backend de l'application Training Rating

Backend exposant une API REST permettant de consommer les services métiers de gestion des notes.

## Prérequis

L'application nécessite que le `JDK 8` et `Maven 3` soient installés.

### Sources de données

#### Base de données

L'application utilise une base de données In-memory avec le profile `dev`.

Pour les autres profiles, une base de données PostgreSQL est utilisée.
Par défault, la base de données est nommée `tr` avec l'utilisateur `postgres` et le mot de passe `sopra*`.

#### LDAP

L'application récupère certainnes informations depuis le LDAP Sopra Steria.
La connexion au LDAP n'est active qu'avec le profile `prod`.
L'accès au LDAP nécessite d'être connecté au réseau Sopra Steria physiquement ou via Pulse.

## Démarrage

### Profiles

3 profiles Spring sont disponibles pour configurer l'application en fonction des environnements :

* mem : permet de démarrer avec une base de données in-memory hors du réseau Sopra sans LDAP
* dev : permet de démarrer avec une base de données PostgreSQL hors du réseau Sopra sans LDAP
* prod : permet de démarrer avec une base de données PostgreSQL sur le réseau Sopra connecté au LDAP

Les commandes suivantes doivent être saisies à la racine du projet backend

Via Maven : 

`mvn spring-boot:run --spring.profiles.active=[dev|mem|prod]`

Via l'IDE.

Via la CLI standard :

`mvn package`
`java -jar target/NOM_DU_JAR --spring.profiles.active=[dev|mem|prod]`

Lorsque l'application est démarrée la documentation de l'API REST est disponible à l'adresse :

`http://localhost:8080/swagger-ui.html`