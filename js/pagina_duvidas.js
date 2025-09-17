document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".pgt-item"); // corrigido

  faqItems.forEach(item => {
    const resposta = item.querySelector(".resposta");

    // Abrir ao passar o mouse
    item.addEventListener("mouseenter", () => {
      // Fecha todas as outras respostas
      faqItems.forEach(i => {
        const r = i.querySelector(".resposta");
        if (r !== resposta) { // Evita que a resposta atual seja fechada e reaberta
          r.style.height = "0px";
          i.classList.remove("ativo");
        }
      });

      // Abre a resposta atual
      const scrollHeight = resposta.scrollHeight;
      resposta.style.height = scrollHeight + "px";
      item.classList.add("ativo");
    });

    // Fechar ao tirar o mouse da pergunta ou resposta
    item.addEventListener("mouseleave", () => {
      resposta.style.height = "0px";
      item.classList.remove("ativo");
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contato form");
  const msgBar = document.getElementById("msgBar");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // não recarrega a página

    // mostra a mensagem
    msgBar.textContent = " Sua mensagem foi enviada com sucesso!";
    msgBar.classList.add("show");

    // esconde depois de 3 segundos
    setTimeout(() => {
      msgBar.classList.remove("show");
    }, 3000);

    // limpa o formulário
    form.reset();
  });
});


