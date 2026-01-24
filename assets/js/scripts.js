fetch("head.html")
      .then(res => res.text())
      .then(html => document.head.insertAdjacentHTML("beforeend", html));
      
  document.querySelectorAll("[data-component]").forEach(el => {
  fetch(el.dataset.component)
    .then(res => res.text())
    .then(html => el.innerHTML = html);
});