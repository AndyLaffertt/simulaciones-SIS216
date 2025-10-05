document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar");

  if (navbarContainer) {
    fetch("/navbar.html")
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar navbar");
        return res.text();
      })
      .then(data => {
        navbarContainer.innerHTML = data;
      })
      .catch(err => {
        console.error("No se pudo cargar la barra de navegación:", err);
      });
  }
});
