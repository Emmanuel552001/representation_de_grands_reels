**evaluer_rpn(expression)**
Début
  Initialiser une pile vide `stack`

  Pour chaque élément `token` dans `expression` : 
    Si `token` est un opérateur (+, -, *, /) :
      Si la taille de `stack` < 2 :
        Lever une erreur "Expression RPN invalide !"
      Fin Si
      
      Retirer le dernier élément de `stack` et l'affecter à `b`
      Retirer le dernier élément de `stack` et l'affecter à `a`

      Si `token` est "+" :
        Empiler le résultat de addition_binaire(a, b)
      Sinon Si `token` est "-" :
        Empiler le résultat de soustraction_binaire(a, b)
      Sinon Si `token` est "*" :
        Empiler le résultat de multiplication_binaire(a, b)
      Sinon Si `token` est "/" :
        Empiler le résultat de division_binaire(a, b)
      Fin Si
    Sinon :  (Si `token` est un nombre)
      Si `token` n'est pas un nombre valide :
        Lever une erreur "Nombre invalide : token"
      Fin Si
      Empiler `token` dans `stack`
    Fin Si
  Fin Pour

  Si la taille de `stack` n'est pas égale à 1 :
    Lever une erreur "Expression RPN mal formée !"
  Fin Si

  Retourner le seul élément restant dans `stack`
Fin



**convertir_en_binaire(nombre)**
Début
  Décomposer `nombre` en `signe`, `entierStr` et `decimalStr` avec `analyserNombre()`
  Convertir la partie entière (`entierStr`) en entier avec `BigInt`

  Définir `bit_signe` : '1' si le nombre est négatif, sinon '0'
  Convertir `entier` en binaire sur 63 bits (`bit_entier`)
  Convertir la partie décimale (`decimalStr`) en binaire avec `decimal_en_binaire()` (`bit_decimal`)

  Retourner la chaîne binaire : `bit_signe.bit_entier.bit_decimal`
Fin

**analyserNombre(nombreStr)**
Début
  Vérifier si `nombreStr` commence par '-' pour déterminer `signe`
  Supprimer le signe '-' de `nombreStr`
  Diviser `nombreStr` en deux parties autour du '.' :
    - `entierPart` : Partie entière
    - `decimalPart` : Partie décimale (par défaut '0' si inexistante)
  Si `entierPart` est vide :
    Affecter '0' à `entierPart`

  Retourner `[signe, entierPart, decimalPart]`
Fin

**decimal en binaire(decimalStr)**
Début
  Convertir `decimalStr` en nombre décimal avec `parseFloat("0." + decimalStr)`
  Initialiser une chaîne vide `bits`

  Tant que `decimal > 0` et longueur de `bits` < 64 :
    Multiplier `decimal` par 2
    Si le résultat est supérieur ou égal à 1 :
      Ajouter '1' à `bits`
      Soustraire 1 de `decimal`
    Sinon :
      Ajouter '0' à `bits`
    Fin Si
  Fin Tant que

  Compléter `bits` avec des '0' pour atteindre 64 bits
  Retourner `bits`
Fin
