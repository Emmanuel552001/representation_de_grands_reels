function convertir_en_binaire(nombre) {
    const [entier_string, decimal_string] = nombre.toString().split('.');
    const binaire_entier = entier_en_binaire(parseInt(entier_string, 10));
    const binaire_decimal = decimal_en_binaire(decimal_string);
    return `${binaire_entier}.${binaire_decimal}`;
}

function decimal_en_binaire(decimal_string) {
    const puissances_negatives2 = [];
    for (let i = 1; i <= 64; i++) {
        puissances_negatives2.push(Math.pow(2, -i));
    }

    let partieDecimale = decimal_string ? parseFloat(`0.${decimal_string}`) : 0;
    let binaire_decimale = '';

    for (const puissance of puissances_negatives2) {
        if (partieDecimale >= puissance) {
            binaire_decimale += '1';
            partieDecimale -= puissance;
        } else {
            binaire_decimale += '0';
        }
    }

    return binaire_decimale;
}

function entier_en_binaire(n) {
    const puissancesDe2 = [];
    for (let i = 0; i < 63; i++) {
        puissancesDe2.push(Math.pow(2, i));
    }

    const binaire = [];
    for (let i = 62; i >= 0; i--) {
        if (n >= puissancesDe2[i]) {
            binaire.push(1);
            n -= puissancesDe2[i];
        } else {
            binaire.push(0);
        }
    }
    return binaire.join('');
}



// les calculs 

function addition_binaire(x, y) {
    let x_binaire = convertir_en_binaire(x);
    const [x_entier, x_decimal] = x_binaire.split('.');
    let y_binaire = convertir_en_binaire(y);
    const [y_entier, y_decimal] = y_binaire.split('.');

    let retenue = 0;
    let resultat_entier = '';
    let resultat_decimal = '';

    for (let i = 1; i <= 64; i++) {
        let bit_x = i < x_decimal.length ? parseInt(x_decimal[i]) : 0;
        let bit_y = i < y_decimal.length ? parseInt(y_decimal[i]) : 0;

        let somme = bit_x + bit_y + retenue;
        if (somme === 2) {
            resultat_decimal = '0' + resultat_decimal;
            retenue = 1;
        } else if (somme === 3) {
            resultat_decimal = '1' + resultat_decimal;
            retenue = 1;
        } else {
            resultat_decimal = somme.toString() + resultat_decimal;
            retenue = 0;
        }
    }

    for (let i = 0; i < 63; i++) {
        let bit_x = i < x_entier.length ? parseInt(x_entier[i]) : 0;
        let bit_y = i < y_entier.length ? parseInt(y_entier[i]) : 0;

        let somme = bit_x + bit_y + retenue;
        if (somme === 2) {
            resultat_entier += '0';
            retenue = 1;
        } else if (somme === 3) {
            resultat_entier += '1';
            retenue = 1;
        } else {
            resultat_entier += somme.toString();
            retenue = 0;
        }
    }

    if (retenue === 1) {
        resultat_entier = '1' + resultat_entier;
    }
    return resultat_entier + '.' + resultat_decimal;
}


/*bertille */

// Fonction pour soustraire 2 nombres binaires
function soustraction_binaire(nombre1, nombre2) {
    // Conversion des nombres décimaux en binaire en utilisant votre fonction convertir_en_binaire
    const binaire1 = convertir_en_binaire(nombre1);
    const binaire2 = convertir_en_binaire(nombre2);

    console.log(`Nombre 1 (${nombre1}) en binaire : ${binaire1}`);
    console.log(`Nombre 2 (${nombre2}) en binaire : ${binaire2}`);

    // Séparer les parties entière et décimale
    const [entier1, dec1 = ""] = binaire1.split('.');
    const [entier2, dec2 = ""] = binaire2.split('.');

    // Aligner les longueurs des parties entière et décimale
    const maxLongueurEntiers = Math.max(entier1.length, entier2.length);
    const maxLongueurDecimales = Math.max(dec1.length, dec2.length);

    const entier1Align = entier1.padStart(maxLongueurEntiers, '0');
    const entier2Align = entier2.padStart(maxLongueurEntiers, '0');
    const dec1Align = dec1.padEnd(maxLongueurDecimales, '0');
    const dec2Align = dec2.padEnd(maxLongueurDecimales, '0');

    // Soustraction des parties entière et décimale
    const { resultat: resultatDecimales, retenue: retenueDecimale } = soustraction_binaire_alignee(dec1Align, dec2Align, true);

    // Soustraction de la partie entière avec retenue si besoin
    const { resultat: resultatEntiers } = retenueDecimale === 1
        ? soustraction_binaire_alignee(entier1Align, ajouter_retenue(entier2Align))
        : soustraction_binaire_alignee(entier1Align, entier2Align);

    // Combiner les parties entière et décimale
    const resultatBinaire = `${resultatEntiers}.${resultatDecimales}`;

    // Convertir le résultat binaire en décimal
    const resultatDecimal = convertir_binaire_en_decimal(resultatBinaire);

    // Vérification de la cohérence
    const verifDecimal = nombre1 - nombre2;
    const coherent = Math.abs(resultatDecimal - verifDecimal) < 1e-10;

    // Affichage des résultats
    console.log(`Résultat binaire : ${resultatBinaire}`);
    console.log(`Résultat décimal (depuis le binaire) : ${resultatDecimal}`);
    console.log(`Vérification cohérence : ${coherent ? "OK" : "Erreur"}`);

    return {
        binaire: resultatBinaire,
        decimal: resultatDecimal,
        coherent
    };
}

// Fonction pour soustraire deux chaînes binaires alignées
function soustraction_binaire_alignee(binaire1, binaire2, isDecimal = false) {
    let retenue = 0;
    const resultat = [];
    const longueur = binaire1.length;

    for (let i = longueur - 1; i >= 0; i--) {
        const bit1 = parseInt(binaire1[i] || '0', 10);
        const bit2 = parseInt(binaire2[i] || '0', 10);

        let diff = bit1 - bit2 - retenue;
        if (diff < 0) {
            diff += 2; // Gestion de la retenue
            retenue = 1;
        } else {
            retenue = 0;
        }

        resultat.unshift(diff); // Ajoute le bit au début
    }

    // Convertir le tableau en chaîne
    let resultatStr = resultat.join('');

    // Si ce n'est pas un nombre décimal, supprimer les zéros en tête
    if (!isDecimal) {
        resultatStr = resultatStr.replace(/^0+/, '') || '0';
    }

    return { resultat: resultatStr, retenue };
}

// Ajout d'une retenue à une chaîne binaire
function ajouter_retenue(binaire) {
    const longueur = binaire.length;
    let resultat = [];
    let retenue = 1;

    for (let i = longueur - 1; i >= 0; i--) {
        const bit = parseInt(binaire[i], 10) + retenue;
        if (bit === 2) {
            resultat.unshift(0);
            retenue = 1;
        } else {
            resultat.unshift(bit);
            retenue = 0;
        }
    }

    return resultat.join('');
}

// Fonction pour convertir un nombre binaire (sous forme "entier.décimal") en décimal
function convertir_binaire_en_decimal(binaire) {
    const [entier, decimale = ""] = binaire.split('.');
    const entierDecimal = parseInt(entier, 2);
    let decimalDecimal = 0;

    for (let i = 0; i < decimale.length; i++) {
        decimalDecimal += parseInt(decimale[i], 10) * Math.pow(2, -(i + 1));
    }

    return entierDecimal + decimalDecimal;
}
/* bertille */



function calculate() {
    const expression = document.getElementById('expression').value;
    
    if (!expression) {
        alert('Entre une expression valide.');
        return;
    }
    const resultat = evaluerNPI(expression);
    console.log(resultat)
    afficher_resultat(resultat);
}
function afficher_resultat(resultat) {
    document.getElementById('result').innerText = `Résultat : ${resultat}`;
    document.getElementById('binaryDisplay').innerText = `En binaire : ${convertir_en_binaire(resultat)}`;
}

document.getElementById('calculateBtn').addEventListener('click', calculate);




// notation plonaise inverseéé
/* declarer une pile , empiler si nombre sinon desempiler faire calcul et rempiler resultat*/
function evaluerNPI(expression) {
    
    const pile = [];
    const elements = expression.split(' ');
    console.log(elements);
    
    for (const element of elements) {
        console.log(typeof(element))
        if (isOperande(element)) {
            pile.push(element);
            console.log(pile)

        } else if (isOperateur(element)) {
            const operande2 = pile.pop();
            const operande1 = pile.pop();

            let resultat;
            switch (element) {
                case '+':
                    resultat = addition_binaire(operande1,operande2);
                    break;
                case '-':
                    resultat = soustraction_binaire(operande1,operande2);
                    break;
                case '*':
                    resultat = multiplication_binaire(operande1,operande2);
                    break;
                case '/':
                    resultat = division_binaire(operande1,operande2);;
                    break;
                default:
                    throw new Error(`Operateur non reconnu : ${element}`);
            }
            pile.push(resultat);
        } else if (element === "") {
            continue;
        }
        else {throw new Error(`element non reconnu : ${element}`);}
    }

    return pile.pop();
}

function isOperande(element) {
    return(!isNaN(parseFloat(element)));
}

function isOperateur(element) {
    return ['+', '-', '*', '/'].includes(element);
}
let y = convertir_en_binaire(12);
console.log(convertir_binaire_en_decimal(y))
let x=addition_binaire(12,6); // comportement etrange ici pour les valeurs paire
console.log(x);
console.log(convertir_binaire_en_decimal(x));