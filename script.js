/* =================================
   1. VARIABLES DU JEU
================================= */

const NOMBRE_INITIAL = 17;
const MIN_RETRAIT = 1;
const MAX_RETRAIT = 3;

let nombreAllumettes = NOMBRE_INITIAL;
let tourJoueur = true;
let partieTerminee = false;
let difficulte = "facile";

/* =================================
   2. ELEMENTS HTML
================================= */

const affichageAllumettes = document.getElementById("allumettes");
const affichageNombre = document.getElementById("nombre-allumettes");
const message = document.getElementById("message");

const boutonsJeu = document.querySelectorAll(".bouton-jeu");
const boutonRecommencer = document.getElementById("recommencer");

const fenetreResultat = document.getElementById("fenetre-resultat");
const resultatTitre = document.getElementById("resultat-titre");
const resultatMessage = document.getElementById("resultat-message");
const resultatSousTitre = document.getElementById("resultat-sous-titre");
const zoneConfettis = document.getElementById("confettis");

const boutonRejouer = document.getElementById("rejouer");
const boutonQuitter = document.getElementById("quitter");

const selectDifficulte = document.getElementById("difficulte");

/* =================================
   3. AFFICHER LES ALLUMETTES
================================= */

function afficherAllumettes() {

    affichageAllumettes.innerHTML = "";

    for (let i = 0; i < nombreAllumettes; i++) {

        const allumette = document.createElement("div");

        allumette
            .classList
            .add("allumette");

        affichageAllumettes.appendChild(allumette);
    }

    affichageNombre.textContent = nombreAllumettes;
}

/* =================================
   4. ACTUALISER LES BOUTONS
================================= */

function actualiserBoutons() {

    boutonsJeu.forEach(function (bouton) {

        const nombre = Number(bouton.dataset.nombre);

        bouton.disabled = !tourJoueur || partieTerminee || nombre > nombreAllumettes;

    });

}

/* =================================
   5. RETIRER DES ALLUMETTES
================================= */

function retirerAllumettes(nombre, joueur) {

    if (partieTerminee) {
        return;
    }

    if (nombre < MIN_RETRAIT || nombre > MAX_RETRAIT || nombre > nombreAllumettes) {
        return;
    }

    nombreAllumettes -= nombre;

    afficherAllumettes();

    if (nombreAllumettes === 0) {

        terminerPartie(joueur);

        return;
    }

    tourJoueur = !joueur;

    actualiserBoutons();

    if (!tourJoueur) {

        message.textContent = "L'ordinateur réfléchit...";

        setTimeout(tourOrdinateur, 800);

    } else {

        message.textContent = "C'est à toi de jouer !";
    }

}

/* =================================
   6. STRATEGIE DE L'ORDINATEUR
================================= */

function choisirRetraitOrdinateur() {

    // Niveau facile : choix aléatoire
    if (difficulte === "facile") {

        return Math.min(Math.floor(Math.random() * 3) + 1, nombreAllumettes);
    }

    // Niveau moyen : stratégie dans 70 % des cas
    if (difficulte === "moyen") {

        if (Math.random() >= 0.7) {

            return Math.min(Math.floor(Math.random() * 3) + 1, nombreAllumettes);
        }
    }

    // Niveaux moyen et difficile : essaie de laisser un multiple de 4
    const reste = nombreAllumettes % 4;

    if (reste !== 0) {
        return reste;
    }

    // Si la position est défavorable, choix aléatoire
    return Math.min(Math.floor(Math.random() * 3) + 1, nombreAllumettes);
}

/* =================================
   7. TOUR DE L'ORDINATEUR
================================= */

function tourOrdinateur() {

    if (partieTerminee || tourJoueur) {
        return;
    }

    const nombre = choisirRetraitOrdinateur();

    message.textContent = "L'ordinateur retire " + nombre + " allumette(s).";

    retirerAllumettes(nombre, false);
}

/* =================================
   8. FIN DE LA PARTIE
================================= */

function terminerPartie(joueur) {

    partieTerminee = true;

    fenetreResultat
        .classList
        .remove("hidden");

    zoneConfettis.innerHTML = "";

    if (joueur) {

        resultatSousTitre.textContent = "VICTOIRE";

        resultatTitre.textContent = "Félicitations !";

        resultatMessage.textContent = "Tu as pris la dernière allumette. Tu remportes la partie !";

        resultatTitre.style.color = "#f0bd68";

        lancerConfettis();

    } else {

        resultatSousTitre.textContent = "FIN DE LA PARTIE";

        resultatTitre.textContent = "L'ordinateur a gagné !";

        resultatMessage.textContent = "Cette fois, l'ordinateur a été plus malin. Retente ta chance !";

        resultatTitre.style.color = "#8fbaff";
    }

    actualiserBoutons();
}

/* =================================
   9. CONFETTIS
================================= */

function lancerConfettis() {

    const couleurs = ["#f0bd68", "#8fbaff", "#ff6b6b", "#7ce0b0", "#c4a1ff"];

    for (let i = 0; i < 100; i++) {

        const confetti = document.createElement("div");

        confetti
            .classList
            .add("confetti");

        confetti.style.left = Math.random() * 100 + "%";

        confetti.style.backgroundColor = couleurs[Math.floor(Math.random() * couleurs.length)];

        confetti.style.animationDuration = (2 + Math.random() * 2) + "s";

        confetti.style.animationDelay = Math.random() * 1.5 + "s";

        zoneConfettis.appendChild(confetti);
    }

}

/* =================================
   10. RECOMMENCER UNE PARTIE
================================= */

function recommencerPartie() {

    nombreAllumettes = NOMBRE_INITIAL;

    tourJoueur = true;

    partieTerminee = false;

    fenetreResultat
        .classList
        .add("hidden");

    zoneConfettis.innerHTML = "";

    message.textContent = "C'est à toi de jouer !";

    afficherAllumettes();

    actualiserBoutons();
}

/* =================================
   11. EVENEMENTS DES BOUTONS
================================= */

// Boutons pour retirer les allumettes
boutonsJeu.forEach(function (bouton) {

    bouton.addEventListener("click", function () {

        const nombre = Number(bouton.dataset.nombre);

        retirerAllumettes(nombre, true);

    });

});

// Bouton pour recommencer
boutonRecommencer.addEventListener("click", recommencerPartie);

// Bouton pour rejouer après une victoire ou une défaite
boutonRejouer.addEventListener("click", recommencerPartie);

// Bouton pour quitter la partie
boutonQuitter.addEventListener("click", function () {

    fenetreResultat
        .classList
        .add("hidden");

    partieTerminee = true;

    message.textContent = "Partie quittée. Merci d'avoir joué !";

    actualiserBoutons();

});

// Sélection de la difficulté
if (selectDifficulte) {

    selectDifficulte.addEventListener("change", function () {

        difficulte = selectDifficulte.value;

        message.textContent = "Difficulté sélectionnée : " + difficulte;

        recommencerPartie();

    });

}

/* =================================
   12. INITIALISATION
================================= */

recommencerPartie();
