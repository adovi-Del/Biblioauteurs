let etat = {
  vue: 'auteurs',
  auteurId: null,
  categorie: null,
  workIndex: null,
};

function getAuteur(id) /*retrouver un auteur grace a son identifiant*/{
  return DATA.auteurs.find(a => a.id === id); /* Pour chaque auteur a, verifie si son id est egal a l'id recherche.*/
}

function getOeuvres(auteur, cat) /*recuperer les oeuvres correspondant a la categorie choisie*/ {
  if (cat === 'chants')  return auteur.chants;
  if (cat === 'contes')  return auteur.contes;
  if (cat === 'poesies') return auteur.poesies;
}

function nomCategorie(cat) /*sert simplement a transformer 'chant' en chant... */{
  if (cat === 'chants')  return 'Chants';
  if (cat === 'contes')  return 'Contes';
  if (cat === 'poesies') return 'Poésie';
}

// ── BREADCRUMB ──
function afficherBreadcrumb() /*indique a l'utilisateur ou il se trouve.*/{
  const bc = document.getElementById('breadcrumb'); /*cherche dans HTML l'element qui possede:id="breadcrumb"*/
  let html = '<span onclick="allerAuteurs()">🏠 Accueil</span>'; /* creer accueil*/

  if (etat.auteurId) {
    const a = getAuteur(etat.auteurId);
    html += ' › <span onclick="allerCategories(\'' + etat.auteurId + '\')">' + a.nom + '</span>';
  }

  if (etat.categorie) {
    html += ' › <span onclick="allerOeuvres(\'' + etat.categorie + '\')">' + nomCategorie(etat.categorie) + '</span>';
  }

  if (etat.vue === 'titre' || etat.vue === 'texte') {
    const a = getAuteur(etat.auteurId);
    const oeuvre = getOeuvres(a, etat.categorie)[etat.workIndex];
    html += ' › ' + oeuvre.titre;
  }

  bc.innerHTML = html;
}

// ── AFFICHAGE PRINCIPAL ──
function afficher() {
  afficherBreadcrumb();
  const app = document.getElementById('app');

  let retourBtn = '';
  if (etat.vue !== 'auteurs') {
    retourBtn = '<button onclick="retour()">← Retour</button>';
  }

  // PAGE 1 : Liste des auteurs
  if (etat.vue === 'auteurs') {
    app.innerHTML = `
      <div class="label">Choisissez un auteur</div>
      ${DATA.auteurs.map(a => `
        <div class="carte" onclick="allerCategories('${a.id}')">
          <h2>${a.nom}</h2>
        </div>
      `).join('')}
    `;
  }

  // PAGE 2 : Chant / Conte / Poésie
  else if (etat.vue === 'categories') {
    const a = getAuteur(etat.auteurId);
    app.innerHTML = `
      ${retourBtn}
      <div class="label">${a.nom}</div>
      <div class="carte" onclick="allerOeuvres('chants')">
        <h2>Chant</h2>
        <p>${a.chants.length} chant${a.chants.length > 1 ? 's' : ''}</p>
      </div>
      <div class="carte" onclick="allerOeuvres('contes')">
        <h2>Conte</h2>
        <p>${a.contes.length} conte${a.contes.length > 1 ? 's' : ''}</p>
      </div>
      <div class="carte" onclick="allerOeuvres('poesies')">
        <h2>Poésie</h2>
        <p>${a.poesies.length} poème${a.poesies.length > 1 ? 's' : ''}</p>
      </div>
    `;
  }

  // PAGE 3 : Liste numérotée
  else if (etat.vue === 'oeuvres') {
    const a = getAuteur(etat.auteurId);
    const liste = getOeuvres(a, etat.categorie);
    app.innerHTML = `
      ${retourBtn}
      <div class="label">${nomCategorie(etat.categorie)} de ${a.nom}</div>
      ${liste.map((o, i) => `
        <div class="carte carte-ligne" onclick="allerTitre(${i})">
          <span class="numero">${i + 1}</span>
          <p>Cliquer pour voir le titre</p>
        </div>
      `).join('')}
    `;
  }

  // PAGE 4 : Le titre
  else if (etat.vue === 'titre') {
    const a = getAuteur(etat.auteurId);
    const oeuvre = getOeuvres(a, etat.categorie)[etat.workIndex];
    app.innerHTML = `
      ${retourBtn}
      <div class="carte titre-oeuvre" onclick="allerTexte()">
        <h2>${oeuvre.titre}</h2>
        <p>Cliquer pour lire l'œuvre complète →</p>
      </div>
    `;
  }

  // PAGE 5 : Texte complet
  else if (etat.vue === 'texte') {
    const a = getAuteur(etat.auteurId);
    const oeuvre = getOeuvres(a, etat.categorie)[etat.workIndex];
    app.innerHTML = `
      ${retourBtn}
      <div class="texte-complet">
        <h2>${oeuvre.titre}</h2>
        <div class="auteur-nom">— ${a.nom}</div>
        <p>${oeuvre.texte}</p>
      </div>
    `;
  }
}

// ── NAVIGATION ──
function allerAuteurs() {
  etat = { vue: 'auteurs', auteurId: null, categorie: null, workIndex: null };
  afficher();
}

function allerCategories(id) {
  etat = { vue: 'categories', auteurId: id, categorie: null, workIndex: null };
  afficher();
}

function allerOeuvres(cat) {
  etat = { ...etat, vue: 'oeuvres', categorie: cat, workIndex: null };
  afficher();
}

function allerTitre(index) {
  etat = { ...etat, vue: 'titre', workIndex: index };
  afficher();
}

function allerTexte() {
  etat = { ...etat, vue: 'texte' };
  afficher();
}

function retour() {
  if (etat.vue === 'categories') allerAuteurs();
  else if (etat.vue === 'oeuvres')  allerCategories(etat.auteurId);
  else if (etat.vue === 'titre')    allerOeuvres(etat.categorie);
  else if (etat.vue === 'texte')    allerTitre(etat.workIndex);
}

// ── DÉMARRAGE ──
afficher();
