# 🌟 **Les Pinpons** 🌟

## 🎨 **Description**



---

## 🚀 **POC (Proof of Concept)**

### 🖥️ **Vue en temps réel des Hololens avec l'API Device Portal**

Pour tester cette fonctionnalité, rendez-vous sur la branche nommée `stream` dans le dépôt de votre projet. Voici les étapes à suivre pour configurer et utiliser cette fonctionnalité.

#### 📋 **Étapes**

1. **🔗 Connexion des Hololens au réseau**
   - Assurez-vous que vos lunettes Hololens sont connectées au même réseau que votre ordinateur.

2. **⚙️ Activation de l'API Device Portal**
   - Suivez ce tutoriel pour activer l'API Device Portal sur vos Hololens : [Utilisation de Device Portal](https://learn.microsoft.com/en-us/windows/mixed-reality/develop/advanced-concepts/using-the-windows-device-portal).

3. **🌐 Accès à Device Portal**
   - Accédez au portail via l'adresse suivante : `http://<hololens_ip>`. Le port peut être trouvé dans les paramètres de Device Portal.

4. **🛠️ Mise à jour de l'adresse API**
   - Pour accéder au flux vidéo et audio en temps réel des Hololens, mettez à jour l'adresse de l'API dans le fichier `ongoing_call.tsx`.
   - Utilisez le format suivant :  
     ```
     https://{votre_nom_utilisateur_Hololens}:{votre_mot_de_passe_Hololens}@192.168.87.217//api/holographic/stream/live.mp4?holo=true&pv=true&mic=true&loopback=true&RenderFromCamera=true
     ```
   - *Note : Cette méthode n'est pas optimale en termes de sécurité. La prochaine étape prévue est d'implémenter une solution sécurisée via un serveur C#.*

5. **▶️ Lancement de l'application**
   - Lancez l'application avec la commande suivante dans le répertoire racine de votre projet :
     ```bash
     npm start
     ```
   - Profitez de la visualisation en temps réel !

---

### **Reconnaissance de Commandes Vocales**

Pour démontrer notre capacité à utiliser la reconnaissance de commandes vocales, nous avons implémenté un système simple. Voici les étapes pour le tester :

1. **📂 Ouvrir le dossier `Hololens` dans Unity 6**  
   - Assurez-vous que Unity 6 est correctement configuré sur votre machine.

2. **🔨 Construire et déployer l'application sur vos Hololens**  
   - Suivez ce tutoriel détaillé : [Construire et déployer une application Unity sur Hololens](https://learn.microsoft.com/fr-fr/windows/mixed-reality/develop/unity/build-and-deploy-to-hololens).

3. **🚀 Tester l'application**  
   - Une fois l'application lancée, vous verrez deux cubes flottants dans votre champ de vision.  
   - Essayez de prononcer les commandes vocales suivantes :  
     - **"Move up"** pour déplacer les cubes vers le haut.  
     - **"Move down"** pour les déplacer vers le bas.

---

