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
  
  /* --- Évaluation d'une expression en notation polonaise inversée (RPN) --- */
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
          stack.push(convertir_en_decimal(addition_binaire(a, b)));
        } else if (token === "-") {
          stack.push(convertir_en_decimal(soustraction_binaire(a, b)));
        } else if (token === "*") {
          stack.push(convertir_en_decimal(multiplication_binaire(a, b)));
        } else if (token === "/") {
          stack.push(convertir_en_decimal(division_binaire(a, b)));
        }
      } else {
        // Vérifie que le token est un nombre décimal valide
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

    
  function analyserNombre(nombreStr) {
    const signe = nombreStr.startsWith('-');
    const [entierPart, decimalPart = '0'] = nombreStr.replace('-', '').split('.');
    return [signe, entierPart || '0', decimalPart];
  }
  // Convertion décimal en binaire
  function convertir_en_binaire(nombre) {
    let [signe, entierStr, decimalStr] = analyserNombre(nombre.toString());
    verification(nombre);
    let entier = BigInt(entierStr);
    let bit_signe = signe ? '1' : '0';
    let bit_entier = entier.toString(2).padStart(63, '0').slice(-63);
    let bit_decimal = decimal_en_binaire(decimalStr);
    return `${bit_signe}${bit_entier}.${bit_decimal}`;
  }
  function decimal_en_binaire(decimalStr) {
    let numerator = BigInt(decimalStr === "" ? "0" : decimalStr);
    let denominator = 10n ** BigInt(decimalStr.length);
    let bits = "";
    for (let i = 0; i < 64; i++) {
      numerator *= 2n;
      let bit = numerator / denominator;
      bits += bit.toString();
      numerator %= denominator;
    }
    return bits;
  }

  function convertir_en_decimal(binaire) {
    let [entierPart, fractionPart] = binaire.split('.');
    let sign = (entierPart[0] === '1') ? '-' : '';
    let bits_entier = entierPart.slice(1);
    let entierDecimal = BigInt("0b" + bits_entier).toString(10);
  
    // Conveion de la partie fractinaire
    let fractionNumerator = BigInt("0b" + fractionPart);
    const fractionDenom = 2n ** 64n;
    const precision = 20;
    let fractionDigits = "";
    for (let i = 0; i < precision; i++) {
      fractionNumerator *= 10n;
      let digit = fractionNumerator / fractionDenom;
      fractionDigits += digit.toString();
      fractionNumerator %= fractionDenom;
    }
        //on tronque les zéros en fin si inutiles
    fractionDigits = fractionDigits.replace(/0+$/, '');
    return fractionDigits === "" ? sign + entierDecimal : sign + entierDecimal + "." + fractionDigits;
  }
  
  /* --- Vérification des limites (63 bits pour l'entier et 64 chiffres pour la partie décimale d'entrée) --- */
  function verification(nombreStr) {
    let [signe, entierStr, decimalStr] = analyserNombre(nombreStr.toString());
    let entier = BigInt(entierStr);
    const MAX_POSITIVE = 2n ** 63n - 1n;
    const MAX_NEGATIVE = 2n ** 63n; // pour la borne en valeur absolue
    if (!signe && entier > MAX_POSITIVE) {
      throw new Error("Le nombre dépasse la limite positive des 63 bits");
    } else if (signe && entier > MAX_NEGATIVE) {
      throw new Error("Le nombre dépasse la limite négative des 63 bits");
    }
    if (decimalStr.length > 64) {
      throw new Error("Le nombre dépasse la limite des 64 chiffres pour la partie décimale");
    }
  }
  
  /* --- Addition en opérant directement sur les chaînes binaires --- */
  function addition_binaire(x, y) {
    let x_binaire = convertir_en_binaire(x);
    let y_binaire = convertir_en_binaire(y);
    let [x_entier, x_fraction] = [x_binaire.slice(0, 64), x_binaire.split('.')[1]];
    let [y_entier, y_fraction] = [y_binaire.slice(0, 64), y_binaire.split('.')[1]];
  
    // Addition de la partie fractionnaire
    let retenue = 0;
    let resultat_fraction = "";
    for (let i = 63; i >= 0; i--) {
      let somme = parseInt(x_fraction[i]) + parseInt(y_fraction[i]) + retenue;
      resultat_fraction = (somme % 2) + resultat_fraction;
      retenue = Math.floor(somme / 2);
    }
    
    // Addition de la partie entière
    let resultat_entier = "";
    for (let i = 63; i >= 1; i--) { 
      let somme = parseInt(x_entier[i]) + parseInt(y_entier[i]) + retenue;
      resultat_entier = (somme % 2) + resultat_entier;
      retenue = Math.floor(somme / 2);
    }
    // Si une retenue , c'est un dépassement de 63 bits
    if (retenue !== 0) {
      throw new Error("Dépassement de capacité en addition (overflow)");
    }
    let signe_resultat = x_entier[0]; 
    return `${signe_resultat}${resultat_entier}.${resultat_fraction}`;
  }
  
  /* --- Soustraction en opérant directement sur les chaînes binaires --- */
  function soustraction_binaire(x, y) {
    let x_binaire = convertir_en_binaire(x);
    let y_binaire = convertir_en_binaire(y);
    let [x_entier, x_fraction] = [x_binaire.slice(0, 64), x_binaire.split('.')[1]];
    let [y_entier, y_fraction] = [y_binaire.slice(0, 64), y_binaire.split('.')[1]];
    //si y est négatif, on fait une addition
    if (y_entier[0] === '1') return addition_binaire(x, (BigInt(y) * -1n).toString());
    // Si x est négatif, on retourn
    if (x_entier[0] === '1') return "-" + soustraction_binaire((BigInt(x) * -1n).toString(), y);
    let retenue = 0;
    let resultat_fraction = "";
    for (let i = 63; i >= 0; i--) {
      let bit_x = parseInt(x_fraction[i]);
      let bit_y = parseInt(y_fraction[i]) + retenue;
      if (bit_x < bit_y) {
        bit_x += 2;
        retenue = 1;
      } else {
        retenue = 0;
      }
      resultat_fraction = (bit_x - bit_y) + resultat_fraction;
    }
    let resultat_entier = "";
    for (let i = 63; i >= 1; i--) {
      let bit_x = parseInt(x_entier[i]);
      let bit_y = parseInt(y_entier[i]) + retenue;
      if (bit_x < bit_y) {
        bit_x += 2;
        retenue = 1;
      } else {
        retenue = 0;
      }
      resultat_entier = (bit_x - bit_y) + resultat_entier;
    }
    if (retenue !== 0) {
      throw new Error("Dépassement de capacité en soustraction (underflow)");
    }
    let signe_resultat = "0"; // ici résultat positif
    return `${signe_resultat}${resultat_entier}.${resultat_fraction}`;
  }
  
  /* --- Multiplication en opérant sur la représentation binaire complète --- */
  function multiplication_binaire(x, y) {
    let x_binaire = convertir_en_binaire(x);
    let y_binaire = convertir_en_binaire(y);
    let x_signe = x_binaire[0], y_signe = y_binaire[0];
    let x_val = x_binaire.slice(1).replace('.', '');
    let y_val = y_binaire.slice(1).replace('.', '');
    let produit = BigInt("0b" + x_val) * BigInt("0b" + y_val);

    let total_bits = 127 * 2; 
    let produit_binaire = produit.toString(2).padStart(254, '0');
    let entier_length = 63; 
    let bit_entier = produit_binaire.slice(0, entier_length);
    let bit_fraction = produit_binaire.slice(entier_length, entier_length + 64);
    if (produit_binaire.slice(0, entier_length).length > 63) {
      throw new Error("Dépassement de capacité en multiplication (overflow)");
    }
    let signe_resultat = (x_signe === y_signe) ? '0' : '1';
    return `${signe_resultat}${bit_entier}.${bit_fraction}`;
  }
  //console.log(multiplication_binaire("7775575545.2489922482547", "74"));
  
  /* --- Division en opérant sur la représentation binaire complète --- */
  function division_binaire(x, y) {
    if (y === "0" || y === "-0") {
      throw new Error("Division par zéro !");
    }
    let x_binaire = convertir_en_binaire(x);
    let y_binaire = convertir_en_binaire(y);
    let x_signe = x_binaire[0], y_signe = y_binaire[0];
    let x_val = x_binaire.slice(1).replace('.', '');
    let y_val = y_binaire.slice(1).replace('.', '');
    
    let x_full = BigInt("0b" + x_val);
    let y_full = BigInt("0b" + y_val);
    let quotient = x_full / y_full;
    let reste = x_full % y_full;
    let quotient_binaire = quotient.toString(2).padStart(63, '0');
    // Calcul de la partie fractionnaire
    let bit_fraction = "";
    for (let i = 0; i < 64; i++) {
      reste *= 2n;
      if (reste >= y_full) {
        bit_fraction += '1';
        reste -= y_full;
      } else {
        bit_fraction += '0';
      }
    }
    let signe_resultat = (x_signe === y_signe) ? '0' : '1';
    return `${signe_resultat}${quotient_binaire.slice(-63)}.${bit_fraction}`;
  }
  


/*Valeur de test 
  646651651616465.241411654 16416165161616.156165156161 +

  2 4 - => dépassement de capacité en soustraction (underflow)
  -2 4 + => -6
