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

