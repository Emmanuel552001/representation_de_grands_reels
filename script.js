document.getElementById("calculateBtn").addEventListener("click", () => {
  const expressionInput = document.getElementById("expression").value.trim();
  const expression = expressionInput.split(" ");
  try {
      const result = evaluer_rpn(expression);
      document.getElementById("result").textContent = `Résultat : ${result}`;
  } catch (error) {
      document.getElementById("result").textContent = `Errpeur : ${error.message}`;
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

          let result;
          if (token === "+") {
              result = convertir_binaire_en_decimal(addition_binaire(a, b));
              console.log("Resultat : " + result)
          } else if (token === "-") {
              result = convertir_binaire_en_decimal(soustraction_binaire(a, b));
          } else if (token === "*") {
              result = convertir_binaire_en_decimal(multiplication_binaire(a, b));
          } else if (token === "/") {
              result = convertir_binaire_en_decimal(division_binaire(a, b));
          }
          verification(result);
          stack.push(result);
      } else {
          if (!/^-?\d+(\.\d+)?$/.test(token)) {
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

function convertir_en_binaire(nombreStr) {
  const [signe, entierStr, decimalStr] = analyserNombre(nombreStr);
  const entier = BigInt(entierStr);
  let bit_signe = signe ? '1' : '0';
  let bit_entier = entier.toString(2).padStart(63, '0').slice(-63);
  let bit_decimal = decimal_en_binaire(decimalStr.padEnd(20, '0').slice(0, 20));
  return `${bit_signe}.${bit_entier}.${bit_decimal}`;
}

function analyserNombre(nombreStr) {
  const signe = nombreStr.startsWith('-');
  const [entierPart, decimalPart = '0'] = nombreStr.replace('-', '').split('.');
  return [signe, entierPart || '0', (decimalPart || '0').padEnd(20, '0').slice(0, 20)];
}

function decimal_en_binaire(decimalStr) {
  const scaled = BigInt(decimalStr.padEnd(20, '0').slice(0, 20));
  let bits = '';
  let value = scaled;
  const divisor = 100000000000000000000n; // 10^20

  for (let i = 0; i < 64; i++) {
      value *= 2n;
      if (value >= divisor) {
          bits += '1';
          value -= divisor;
      } else {
          bits += '0';
      }
  }
  return bits;
}

function convertir_binaire_en_decimal(binaire) {
  let [signe, partie_entiere, partie_decimale] = binaire.split('.');
  const entier_decimal = partie_entiere ? BigInt('0b' + partie_entiere) : 0n;
  
  const precision = 20;
  const scaler = 10n ** BigInt(precision);
  const binaryValue = BigInt('0b' + partie_decimale.padEnd(64, '0'));
  const decimalPart = (binaryValue * scaler) >> 64n; // Equivalent to / 2^64 but faster ( gpt proposition)

  let decimalStr = decimalPart.toString().padStart(precision, '0').slice(0, precision);
  let resultStr = signe === '1' ? '-' : '';
  resultStr += entier_decimal.toString();
  if (decimalStr !== '0'.repeat(precision)) {
      resultStr += '.' + decimalStr.replace(/0+$/, '').padEnd(20, '0');
  }
  return resultStr;
}

function verification(nombreStr) {
  const MAX_ENTIER = (2n ** 63n) - 1n;
  const [signe, entierStr] = analyserNombre(nombreStr);
  const entier = BigInt(entierStr);
  if (entier > MAX_ENTIER) {
      throw new Error("Overflow: la partie entière dépasse 63 bits");
  }
}

console.log(typeof(Math.abs("-7")))
function addition_binaire(x, y) {
  console.log("X : " + x)
  let x_binaire = convertir_en_binaire(x);
  let y_binaire = convertir_en_binaire(y);
  let [signe_x, x_entier, x_decimal] = x_binaire.split('.');
  let [signe_y, y_entier, y_decimal] = y_binaire.split('.');
  let negatif_x = signe_x === '1';
  let negatif_y = signe_y === '1';
  if (negatif_x && !negatif_y) return soustraction_binaire(y, Math.abs(x).toString());
  if (!negatif_x && negatif_y) return soustraction_binaire(x, Math.abs(y).toString());
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
  if (negatif_y) return addition_binaire(x, Math.abs(y).toString());
  if (negatif_x) return `-${addition_binaire(Math.abs(x).toString(), y)}`;
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
  console.log("Produit binaire : " + produit_binaire)
  let entier_length = x_entier.length + y_entier.length;
  let decimal_length = x_decimal.length + y_decimal.length;
  if (produit_binaire.slice(0, entier_length).length > 126) {
      throw new Error("Dépassement de capacité en multiplication (overflow)"); // a revoir
  }
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
console.log (Math.pow(-2, 9))
console.log (Math.pow(2, -9))
console.log((Math.pow(2, 62)));
console.log ((1 - Math.pow(2, -9)) > Math.pow(2, -9) )

console.log(Math.pow (-2, 62) )

-4
-4.9999