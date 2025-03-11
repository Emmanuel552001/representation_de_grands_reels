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

function evaluer_rpn(expression) {
    let stack = [];

    for (let token of expression) {
        if (["+", "-", "*", "/"].includes(token)) {
            if (stack.length < 2) {
                throw new Error("Expression RPN invalide !");
            }
            let b = stack.pop();
            let a = stack.pop();
            verification(a);
            verification(b);

            if (token === "+") {
                //verification(BigInt(a+b));
                stack.push(convertir_binaire_en_decimal(addition_binaire(a, b)));
            } else if (token === "-") {
                //verification(BigInt(a-b));
                stack.push(convertir_binaire_en_decimal(soustraction_binaire(a, b)));
            } else if (token === "*") {
               // verification(BigInt(a*b));
                stack.push(convertir_binaire_en_decimal(multiplication_binaire(a, b)));
            } else if (token === "/") {
                stack.push(convertir_binaire_en_decimal(division_binaire(a, b)));
            }
            // il push le resultat sans le signe
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
function verification(nombre1,nombre2 =1) {
    const nbremaxentier = 2n ** 63n
    let [signe, entier1, decimal1] = analyserNombre(nombre1.toString());
    entier1 = BigInt(entier1);
    console.log(entier1)
    console.log(nbremaxentier)
    if (BigInt(entier1) > nbremaxentier){
        throw new Error("Le nombre dépasse la limite de 63 bits");
      }
      
      // verification decimal
      const nbremaxdecimal = Math.pow(2, -64).toFixed(50).toString(); // plus petit nombre decimal sur 64 bits => 0.00000000000000000005421010862427522170037264004350
      let [x,y] = nbremaxdecimal.split('.')
      reference_decimal = y //.replace(/^0+/, "") || "0"; // valeur de reference pour comparaison => 00000000000000000005421010862427522170037264004350
      console.log("decimal : " + decimal1.length)
      console.log("reference decimal " + reference_decimal.length)
      if (decimal1.length > reference_decimal.length) {
        throw new Error ("Le nombre dépasse la limite des 64 bits");
      }
      if (decimal1.length = reference_decimal.length && decimal1 > reference_decimal){
        throw new Error ("Le nombre dépasse la limite des 64 bits");
      }
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
//console.log("-1.25 :" + convertir_en_binaire(-1.25))

function convertir_binaire_en_decimal(binaire) {
    let [signe, partie_entiere, partie_decimale] = binaire.split('.');
    let entier_decimal = parseInt(partie_entiere, 2);
    let decimal = 0;
    for (let i = 0; i < partie_decimale.length; i++) {
        decimal += parseInt(partie_decimale[i]) * Math.pow(2, -(i + 1));
    }
    let resultat = entier_decimal + decimal;
    if (signe === '1') {
        resultat *= -1;
    }
    
    return resultat;
}
//console.log("-2,2.200785525 * : " + convertir_binaire_en_decimal(multiplication_binaire(-2,2.200785525)) )

function addition_binaire(x, y) {
    let x_binaire = convertir_en_binaire(x);
    let y_binaire = convertir_en_binaire(y);

    let [signe_x, x_entier, x_decimal] = x_binaire.split('.');
    let [signe_y, y_entier, y_decimal] = y_binaire.split('.');

    let negatif_x = signe_x === '1';
    let negatif_y = signe_y === '1';

    if (negatif_x && !negatif_y) return soustraction_binaire(y, Math.abs(x));
    if (!negatif_x && negatif_y) return soustraction_binaire(x, Math.abs(y));

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
        let somme = parseInt(x_decimal_norm[i]) + parseInt(y_decimal_norm[i]) + retenue;
        resultat_decimal = (somme % 2) + resultat_decimal;
        retenue = Math.floor(somme / 2);
    }

    for (let i = max_entier - 1; i >= 0; i--) {
        let somme = parseInt(x_entier_norm[i]) + parseInt(y_entier_norm[i]) + retenue;
        resultat_entier = (somme % 2) + resultat_entier;
        retenue = Math.floor(somme / 2);
    }

    if (retenue === 1) {
        resultat_entier = '1' + resultat_entier;
    }
    let signe_resultat = negatif_x ? '1' : '0';
    console.log(`${signe_resultat}.${resultat_entier}.${resultat_decimal}`)
    return `${signe_resultat}.${resultat_entier}.${resultat_decimal}`;
}

function soustraction_binaire(x, y) {
    let x_binaire = convertir_en_binaire(x);
    let y_binaire = convertir_en_binaire(y);

    let [signe_x, x_entier, x_decimal] = x_binaire.split('.');
    let [signe_y, y_entier, y_decimal] = y_binaire.split('.');

    let negatif_x = signe_x === '1';
    let negatif_y = signe_y === '1';

    if (negatif_y) return addition_binaire(x, Math.abs(y));
    if (negatif_x) return `-${addition_binaire(Math.abs(x), y)}`;

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
        result_temporaire = `${soustraction_binaire(y, x)}`;
        let [signe_temp, temp_entier, temp_decimal] = result_temporaire.split('.');
    return `1.${temp_entier}.${temp_decimal}`}
    return `0.${resultat_entier}.${resultat_decimal}`;
}



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
    let total_bits = x_entier.length + x_decimal.length + y_entier.length + y_decimal.length;

    let produit_binaire = produit.toString(2).padStart(total_bits, '0');
    
    let entier_length = x_entier.length + y_entier.length;
    let decimal_length = x_decimal.length + y_decimal.length;
    
    let bit_entier = produit_binaire.slice(0, entier_length) || '0';
    let bit_decimal = produit_binaire.slice(entier_length).padEnd(64, '0');
    bit_entier = bit_entier.slice(63);
    bit_decimal = bit_decimal.slice(0,64);

    return `${signe_resultat}.${bit_entier}.${bit_decimal}`;
}
//console.log("2,2.200785525 * " + multiplication_binaire(2,2.200785525) )
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
//console.log("2,2.200785525 / : " + division_binaire(4,2.200785525) )

/*function tester_puissances_de_deux() {
    console.log("Puissances de 2 jusqu'à 2^63:");
    console.log("-----------------------------------------");
    
    for (let i = 0; i <= 63; i++) {
        const nombre = 2n ** BigInt(i);
        const binaire = convertir_en_binaire(nombre);
        console.log(`2^${i} = ${nombre} (décimal) = ${binaire} (binaire)`);
    }
}
tester_puissances_de_deux();*/

/*function binaire_en_bigInt(binaryStr) {
    let result = 0n;
    for (let i = 0; i < binaryStr.length; i++) {
      result = result * 2n + BigInt(binaryStr[i] === "1" ? 1 : 0);
    }
    return result;
  }*/

/*
 let m = Math.pow(2, -64).toFixed(50).toString();
 console.log("m " + m)
console.log (typeof(m))
 //z = m.toFixed(50);
// console.log("z : " + z)
 let [x , y] = m.toString().split('.');
 y = y.replace(/^0+/, "") || "0";
 console.log("Y " + y); */