function validacaoForms() {
  let validador = document.forms["validationForms"]["senhaInputer"].value;
  if (!validador == "") {
    return true;
  } else {
    alert("Digite sua senha para prosseguir!");
    return false;

  }
}