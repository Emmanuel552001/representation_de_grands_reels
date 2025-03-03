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


