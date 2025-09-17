document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const resposta = item.querySelector(".resposta");

    // Abrir ao passar o mouse
    item.addEventListener("mouseenter", () => {
      // Fecha todas as outras respostas
      faqItems.forEach(i => {
        const r = i.querySelector(".resposta");
        r.style.height = "0px";
        i.classList.remove("ativo");
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

