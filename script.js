document.getElementById("calculateBtn").addEventListener("click", () => {
    const expressionInput = document.getElementById("expression").value.trim();
    const expression = expressionInput.split(" ");
    try {
        const result = evaluer_rpn(expression);
        document.getElementById("result").textContent = `Résultat : ${result}`;
    } catch (error) {
        document.getElementById("result").textContent = `Erreur : ${error.message}`;
    }
});

function convertir_en_binaire(nombre) {
    const [signe, entierStr, decimalStr] = analyserNombre(nombre.toString());
    const entier = BigInt(entierStr);

    let bit_signe = signe ? '1' : '0';
    let bit_entier = entier.toString(2).padStart(63, '0').slice(-63);
    let bit_decimal = decimal_en_binaire(decimalStr);
    return `${bit_signe}.${bit_entier}.${bit_decimal}`;
}

function analyserNombre(nombreStr) {
    const signe = nombreStr.startsWith('-');
    const [entierPart, decimalPart = '0'] = nombreStr.replace('-', '').split('.');
    return [signe, entierPart || '0', decimalPart];
}

function decimal_en_binaire(decimalStr) {
    let decimal = parseFloat(`0.${decimalStr}`);
    let bits = '';
    
    while (decimal > 0 && bits.length < 64) {
        decimal *= 2;
        if (decimal >= 1) {
            bits += '1';
            decimal -= 1;
        } else {
            bits += '0';
        }
    }
    
    return bits.padEnd(64, '0');
}
console.log("-2 :" + convertir_en_binaire(-2))

function addition_binaire(x, y) {
    let x_binaire = convertir_en_binaire(x);
    let y_binaire = convertir_en_binaire(y);

    let [signe_x, x_entier, x_decimal] = x_binaire.split('.');
    let [signe_y, y_entier, y_decimal] = y_binaire.split('.');

    let negatif_x = signe_x === '1';
    let negatif_y = signe_y === '1';

    if (negatif_x && !negatif_y) {
        return soustraction_binaire(y, x); 
    } else if (!negatif_x && negatif_y) {
        return soustraction_binaire(x, y);
    }

    let max_entier = Math.max(x_entier.length, y_entier.length);
    let max_decimal = Math.max(x_decimal.length, y_decimal.length);
    
    let x_entier_norm = x_entier.padStart(max_entier, '0');
    let y_entier_norm = y_entier.padStart(max_entier, '0');
    
    let x_decimal_norm = x_decimal.padEnd(max_decimal, '0');
    let y_decimal_norm = y_decimal.padEnd(max_decimal, '0');

    let retenue = 0;
    let resultat_decimal = '';
    let resultat_entier = '';

    for (let i = max_decimal - 1; i >= 0; i--) {
        let bit_x = parseInt(x_decimal_norm[i]);
        let bit_y = parseInt(y_decimal_norm[i]);

        let somme = bit_x + bit_y + retenue;
        resultat_decimal = (somme % 2) + resultat_decimal;
        retenue = Math.floor(somme / 2);
    }

    for (let i = max_entier - 1; i >= 0; i--) {
        let bit_x = parseInt(x_entier_norm[i]);
        let bit_y = parseInt(y_entier_norm[i]);

        let somme = bit_x + bit_y + retenue;
        resultat_entier = (somme % 2) + resultat_entier;
        retenue = Math.floor(somme / 2);
    }

    if (retenue === 1) {
        resultat_entier = '1' + resultat_entier;
    }

    let signe_resultat = negatif_x ? '1' : '0';

    return `${signe_resultat}.${resultat_entier}.${resultat_decimal}`;
}

function soustraction_binaire(x, y) {
    let x_binaire = convertir_en_binaire(x);
    let y_binaire = convertir_en_binaire(y);

    let [signe_x, x_entier, x_decimal] = x_binaire.split('.');
    let [signe_y, y_entier, y_decimal] = y_binaire.split('.');

    let negatif_x = signe_x === '1';
    let negatif_y = signe_y === '1';

    if (negatif_y) {
        return addition_binaire(x, y.slice(1));
    }

    if (negatif_x) {
        return `-${addition_binaire(x.slice(1), y)}`;
    }

    let max_entier = Math.max(x_entier.length, y_entier.length);
    let max_decimal = Math.max(x_decimal.length, y_decimal.length);

    let x_entier_norm = x_entier.padStart(max_entier, '0');
    let y_entier_norm = y_entier.padStart(max_entier, '0');

    let x_decimal_norm = x_decimal.padEnd(max_decimal, '0');
    let y_decimal_norm = y_decimal.padEnd(max_decimal, '0');

    let retenue = 0;
    let resultat_decimal = '';
    let resultat_entier = '';

    // Soustraction des parties décimales
    for (let i = max_decimal - 1; i >= 0; i--) {
        let bit_x = parseInt(x_decimal_norm[i]);
        let bit_y = parseInt(y_decimal_norm[i]) + retenue;

        if (bit_x < bit_y) {
            bit_x += 2;
            retenue = 1;
        } else {
            retenue = 0;
        }

        resultat_decimal = (bit_x - bit_y) + resultat_decimal;
    }

    for (let i = max_entier - 1; i >= 0; i--) {
        let bit_x = parseInt(x_entier_norm[i]);
        let bit_y = parseInt(y_entier_norm[i]) + retenue;

        if (bit_x < bit_y) {
            bit_x += 2;
            retenue = 1;
        } else {
            retenue = 0;
        }

        resultat_entier = (bit_x - bit_y) + resultat_entier;
    }

    if (retenue === 1) {
        return `-${soustraction_binaire(y, x)}`;
    }

    return `0.${resultat_entier}.${resultat_decimal}`;}


function multiplication_binaire(x, y) {
    let x_binaire = convertir_en_binaire(x);
    let y_binaire = convertir_en_binaire(y);

    let [signe_x, x_entier, x_decimal] = x_binaire.split('.');
    let [signe_y, y_entier, y_decimal] = y_binaire.split('.');

    let negatif_x = signe_x === '1';
    let negatif_y = signe_y === '1';
    let signe_resultat = (negatif_x ^ negatif_y) ? '1' : '0';

    let x_full = BigInt("0b" + x_entier + x_decimal);
    let y_full = BigInt("0b" + y_entier + y_decimal);

    let produit = x_full * y_full;

    let produit_binaire = produit.toString(2).padStart(x_entier.length + x_decimal.length + y_entier.length + y_decimal.length, '0');

    let bit_entier = produit_binaire.slice(0, x_entier.length + y_entier.length);
    let bit_decimal = produit_binaire.slice(x_entier.length + y_entier.length).padEnd(64, '0');

    return `${signe_resultat}.${bit_entier}.${bit_decimal}`;
}

function division_binaire(x, y) {
    if (y === "0") {
        throw new Error("Division par zéro !");
    }

    let x_binaire = convertir_en_binaire(x);
    let y_binaire = convertir_en_binaire(y);
    let [signe_x, x_entier, x_decimal] = x_binaire.split('.');
    let [signe_y, y_entier, y_decimal] = y_binaire.split('.');
    let negatif_x = signe_x === '1';
    let negatif_y = signe_y === '1';
    let signe_resultat = (negatif_x ^ negatif_y) ? '1' : '0';
    let x_full = BigInt("0b" + x_entier + x_decimal.padEnd(64, '0')); 
    let y_full = BigInt("0b" + y_entier + y_decimal.padEnd(64, '0'));
    let quotient = x_full / y_full;
    let reste = x_full % y_full;
    let quotient_binaire = quotient.toString(2);
    let bit_decimal = '';
    for (let i = 0; i < 64; i++) {
        reste *= 2n;
        if (reste >= y_full) {
            bit_decimal += '1';
            reste -= y_full;
        } else {
            bit_decimal += '0';
        }
    }

    return `${signe_resultat}.${quotient_binaire}.${bit_decimal}`;
}

function evaluer_rpn(expression) {
    let stack = [];

    for (let token of expression) {
        if (["+", "-", "*", "/"].includes(token)) {
            if (stack.length < 2) {
                throw new Error("Expression RPN invalide !");
            }
            let b = stack.pop();
            let a = stack.pop();

            if (token === "+") {
                stack.push(addition_binaire(a, b));
            } else if (token === "-") {
                stack.push(soustraction_binaire(a, b));
            } else if (token === "*") {
                stack.push(multiplication_binaire(a, b));
            } else if (token === "/") {
                stack.push(division_binaire(a, b));
            }
        } else {
            if (isNaN(parseFloat(token))) {
                throw new Error(`Nombre invalide : ${token}`);
            }
            stack.push(token);
        }
    }

    if (stack.length !== 1) {
        throw new Error("Expression RPN mal formée !");
    }
    return stack[0];
}
