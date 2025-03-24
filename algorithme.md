# Documentation Technique du Script

## Introduction

Ce script permet d'évaluer des expressions mathématiques en utilisant la notation polonaise inversée (RPN, Reverse Polish Notation), qui est une notation postfixée pour les expressions arithmétiques. L'expression est composée de nombres et d'opérations binaires (`+`, `-`, `*`, `/`). Les nombres sont manipulés en tant que chaînes binaires afin de garantir une précision élevée pour les calculs.

Les principales fonctionnalités incluent :
1. L'évaluation des expressions en RPN.
2. La gestion de la conversion entre les formats décimaux et binaires.
3. L'exécution des opérations arithmétiques de base sur les nombres binaires.

### Structure générale
1. **Entrée utilisateur** : L'utilisateur entre une expression mathématique sous forme de chaîne de caractères dans un champ de saisie (`#expression`).
2. **Événement de calcul** : Lorsqu'un utilisateur clique sur le bouton de calcul (`#calculateBtn`), le script évalue l'expression et affiche le résultat ou un message d'erreur.

## Description des fonctions

### 1. `evaluer_rpn(expression)`
Évalue une expression en notation polonaise inversée (RPN).

**Paramètres :**
- `expression` (array de chaînes) : Une liste d'opérandes et d'opérateurs à évaluer. Les opérandes sont des nombres (en format chaîne), et les opérateurs sont des symboles arithmétiques (`+`, `-`, `*`, `/`).

**Retour :**
- Le résultat de l'évaluation de l'expression.

**Exceptions :**
- Si l'expression est invalide, une erreur est lancée avec un message explicite.

### 2. `convertir_en_binaire(nombre)`
Convertit un nombre décimal en sa représentation binaire sous forme de chaîne.

**Paramètres :**
- `nombre` (nombre décimal) : Le nombre à convertir.

**Retour :**
- Une chaîne représentant le nombre binaire avec une précision de 64 bits pour la partie fractionnaire.

**Exceptions :**
- Lève une exception si le nombre dépasse les limites acceptées (63 bits pour la partie entière et 64 bits pour la partie fractionnaire).

### 3. `convertir_en_decimal(binaire)`
Convertit une chaîne binaire en sa représentation décimale.

**Paramètres :**
- `binaire` (chaîne binaire) : La chaîne représentant le nombre binaire à convertir.

**Retour :**
- Une chaîne représentant le nombre décimal.

### 4. `analyserNombre(nombreStr)`
Analyse un nombre décimal sous forme de chaîne pour en extraire le signe, la partie entière et la partie fractionnaire.

**Paramètres :**
- `nombreStr` (chaîne) : Le nombre sous forme de chaîne de caractères.

**Retour :**
- Un tableau contenant le signe (booléen), la partie entière et la partie fractionnaire du nombre.

### 5. `decimal_en_binaire(decimalStr)`
Convertit une partie fractionnaire décimale en une chaîne binaire sur 64 bits.

**Paramètres :**
- `decimalStr` (chaîne) : La partie fractionnaire d'un nombre décimal.

**Retour :**
- La partie fractionnaire convertie en binaire sur 64 bits.

### 6. `verification(nombreStr)`
Vérifie les limites du nombre entré, notamment pour la partie entière (63 bits) et la partie fractionnaire (64 bits).

**Paramètres :**
- `nombreStr` (chaîne) : Le nombre à vérifier.

**Retour :**
- Aucun retour, mais une exception est levée si les limites sont dépassées.

### 7. `addition_binaire(x, y)`
Effectue l'addition de deux nombres binaires.

**Paramètres :**
- `x` et `y` (chaînes binaires) : Les deux nombres binaires à additionner.

**Retour :**
- La somme des deux nombres binaires sous forme de chaîne.

**Exceptions :**
- Si un dépassement de capacité (overflow) se produit, une exception est lancée.

### 8. `soustraction_binaire(x, y)`
Effectue la soustraction de deux nombres binaires.

**Paramètres :**
- `x` et `y` (chaînes binaires) : Les deux nombres binaires à soustraire.

**Retour :**
- La différence des deux nombres binaires sous forme de chaîne.

**Exceptions :**
- Si un dépassement de capacité (underflow) se produit, une exception est lancée.

### 9. `multiplication_binaire(x, y)`
Effectue la multiplication de deux nombres binaires.

**Paramètres :**
- `x` et `y` (chaînes binaires) : Les deux nombres binaires à multiplier.

**Retour :**
- Le produit des deux nombres binaires sous forme de chaîne.

**Exceptions :**
- Si un dépassement de capacité (overflow) se produit, une exception est lancée.

### 10. `division_binaire(x, y)`
Effectue la division de deux nombres binaires.

**Paramètres :**
- `x` et `y` (chaînes binaires) : Le numérateur et le diviseur sous forme de chaînes binaires.

**Retour :**
- Le quotient de la division sous forme de chaîne binaire.

**Exceptions :**
- Si le diviseur est zéro, une exception de division par zéro est levée.

## Interaction avec l'interface utilisateur

### 1. `document.getElementById("calculateBtn").addEventListener("click", ...)`
Lorsqu'un utilisateur clique sur le bouton "calculateBtn", cette fonction capture l'expression entrée par l'utilisateur dans le champ de texte `#expression`, la convertit en une liste d'opérandes et d'opérateurs, puis appelle la fonction `evaluer_rpn()` pour effectuer le calcul. Le résultat ou une erreur est affiché dans un élément de la page `#result`.

### 2. Gestion des erreurs
Si une erreur se produit pendant l'évaluation (par exemple, une expression mal formée, une division par zéro, ou un nombre invalide), un message d'erreur est affiché à l'utilisateur.

## Cas d'utilisation

- **Addition** : `"727275775575545.2489922482547", "74", "+"` produit `"727275775575619.2489922482547"`.
- **Division par zéro** : L'entrée `"10", "0", "/"` lance une erreur avec le message `"Division par zéro !"`.

## Conclusion

Ce script fournit une solution robuste pour effectuer des calculs en utilisant la notation polonaise inversée tout en garantissant une haute précision pour les opérations avec des nombres décimaux en utilisant des représentations binaires. Il est capable de gérer des erreurs, de vérifier les limites des nombres et de faire les conversions nécessaires pour effectuer des opérations précises et fiables.
