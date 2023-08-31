const express = require('express');
const path = require('path');
const cors = require('cors')
require('dotenv').config();
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('swagger.yaml')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use('/images', express.static(path.join(__dirname, 'images')))

const db = require("./models");
const userRoutes = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories.routes');
const worksRoutes = require('./routes/works.routes');
db.sequelize.sync().then(() => console.log('db is ready'));
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
module.exports = app;

app.use(express.static(path.join(__dirname, '../frontend')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// app.post('/login', (req, res) => {
// });


// test(
//   app.get('/', (req, res) => {
//     const message = "Bienvenue sur notre page d'accueil générée côté serveur!";

//     // Génération de la réponse HTML côté serveur
//     const html = `
//     <!DOCTYPE html>
//     <html lang="fr">
//     <head>
//     <meta charset="UTF-8">
//     <title>Sophie Bluel - Architecte d'intérieur</title>
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <link rel="preconnect" href="https://fonts.googleapis.com">
//     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//     <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Work+Sans&display=swap" rel="stylesheet">
//     <meta name="description" content="">
//     <link rel="stylesheet" href="./assets/style.css">
//     <script src="C:\Users\Cedric\Desktop\Portfolio-architecte-sophie-bluel-master\Backend\app.js"></script>
//   </head>
//   <body>
//   <header>
//     <h1>Sophie Bluel <span>Architecte d'intérieur</span></h1>
//     <nav>
//       <ul>
//         <li>projets</li>
//         <li>contact</li>
//         <li>login</li>
//         <li><img src="./assets/icons/instagram.png" alt="Instagram"></li>
//       </ul>
//     </nav>
//   </header>
//   <main>
//     <section id="introduction">
//       <figure>
//         <img src="./assets/images/sophie-bluel.png" alt="">
//       </figure>
//       <article>
//         <h2>Designer d'espace</h2>
//         <p>Je raconte votre histoire, je valorise vos idées. Je vous accompagne de la conception à la livraison finale du chantier.</p>
//         <p>Chaque projet sera étudié en commun, de façon à mettre en valeur les volumes, les matières et les couleurs dans le respect de l’esprit des lieux et le choix adapté des matériaux. Le suivi du chantier sera assuré dans le souci du détail, le respect du planning et du budget.</p>
//         <p>En cas de besoin, une équipe pluridisciplinaire peut-être constituée : architecte DPLG, décorateur(trice)</p>
//       </article>
//     </section>
//     <section id="portfolio">
//       <h2>Mes Projets</h2>
//       <div class="gallery">
//         <figure>
//           <img src="assets/images/abajour-tahina.png" alt="Abajour Tahina">
//           <figcaption>Abajour Tahina</figcaption>
//         </figure>
//         <figure>
//           <img src="assets/images/appartement-paris-v.png" alt="Appartement Paris V">
//           <figcaption>Appartement Paris V</figcaption>
//         </figure>
//         <figure>
//           <img src="assets/images/restaurant-sushisen-londres.png" alt="Restaurant Sushisen - Londres">
//           <figcaption>Restaurant Sushisen - Londres</figcaption>
//         </figure>
//         <figure>
//           <img src="assets/images/la-balisiere.png" alt="Villa “La Balisiere” - Port Louis">
//           <figcaption>Villa “La Balisiere” - Port Louis</figcaption>
//         </figure>
//         <figure>
//           <img src="assets/images/structures-thermopolis.png" alt="Structures Thermopolis">
//           <figcaption>Structures Thermopolis</figcaption>
//         </figure>
//         <figure>
//           <img src="assets/images/appartement-paris-x.png" alt="Appartement Paris X">
//           <figcaption>Appartement Paris X</figcaption>
//         </figure>
//         <figure>
//           <img src="assets/images/le-coteau-cassis.png" alt="Pavillon “Le coteau” - Cassis">
//           <figcaption>Pavillon “Le coteau” - Cassis</figcaption>
//         </figure>
//         <figure>
//           <img src="assets/images/villa-ferneze.png" alt="Villa Ferneze - Isola d’Elba">
//           <figcaption>Villa Ferneze - Isola d’Elba</figcaption>
//         </figure>
//         <figure>
//           <img src="assets/images/appartement-paris-xviii.png" alt="Appartement Paris XVIII">
//           <figcaption>Appartement Paris XVIII</figcaption>
//         </figure>
//         <figure>
//           <img src="assets/images/bar-lullaby-paris.png" alt="Bar “Lullaby” - Paris">
//           <figcaption>Bar “Lullaby” - Paris</figcaption>
//         </figure>
//         <figure>
//           <img src="assets/images/hotel-first-arte-new-delhi.png" alt="Hotel First Arte - New Delhi">
//           <figcaption>Hotel First Arte - New Delhi</figcaption>
//         </figure>
//       </div>
//     </section>
//     <section id="contact">
//       <h2>Contact</h2>
//       <p>Vous avez un projet ? Discutons-en !</p>
//       <form action="#" method="post">
//         <label for="name">Nom</label>
//         <input type="text" name="name" id="name">
//         <label for="email">Email</label>
//         <input type="email" name="email" id="email">
//         <label for="message">Message</label>
//         <textarea name="message" id="message" cols="30" rows="10"></textarea>
//         <input type="submit" value="Envoyer">
//       </form>
//     </section>
//   </main>
  
//   <footer>
//     <nav>
//       <ul>
//         <li>Mentions Légales</li>
//       </ul>
//     </nav>
//   </footer>
//   </body>
//   </html>
//   `;
//     res.send(html);
//   });
// )