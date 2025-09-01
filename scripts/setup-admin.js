#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 Configuration Admin HIDDEN SPINGFIELD\n');
console.log('Ce script va créer votre compte administrateur.\n');

rl.question('Nom d\'utilisateur admin: ', (username) => {
  rl.question('Mot de passe admin: ', (password) => {
    rl.question('Clé de setup (depuis .env.local ADMIN_SETUP_KEY): ', async (setupKey) => {
      
      try {
        const response = await fetch('http://localhost:3000/api/auth/setup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            setupKey
          })
        });

        const data = await response.json();

        if (response.ok) {
          console.log('\n✅ Admin créé avec succès!');
          console.log(`Username: ${data.username}`);
          console.log('\nVous pouvez maintenant vous connecter sur /admin');
        } else {
          console.error('\n❌ Erreur:', data.error);
        }
      } catch (error) {
        console.error('\n❌ Erreur de connexion au serveur. Assurez-vous que le serveur est démarré (npm run dev)');
      }

      rl.close();
    });
  });
});

rl.on('close', () => {
  process.exit(0);
});