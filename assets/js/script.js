// ── Page Loader ──────────────────────────────
(function () {
  const loader = document.getElementById("page-loader");
  if (!loader) return;
  const hide = () => loader.classList.add("loader-hide");
  // Hide after 2.6 s max, or as soon as the page is ready
  const timer = setTimeout(hide, 2600);
  window.addEventListener("load", () => {
    clearTimeout(timer);
    setTimeout(hide, 2500);
  });
})();

// ── Load header and footer components ────────
async function loadComponent(id, path) {
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
  // Fix asset paths when loaded from a subdirectory page
  if (isInSubdir) {
    document
      .getElementById(id)
      .querySelectorAll("[src],[href]")
      .forEach((el) => {
        ["src", "href"].forEach((attr) => {
          const val = el.getAttribute(attr);
          if (val && val.startsWith("./")) {
            el.setAttribute(attr, "../" + val.slice(2));
          }
        });
      });
  }
}

const isInSubdir = window.location.pathname.includes("/pages/");
const componentBase = isInSubdir ? "../components/" : "components/";

Promise.all([
  loadComponent("header-placeholder", componentBase + "header.html"),
  loadComponent("footer-placeholder", componentBase + "footer.html"),
]).then(() => {
  const navbar = document.querySelector(".navbar");
  function handleScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  // Redirect dead links (#) to 404 page — skip on 404 page itself
  if (!window.location.pathname.includes("404.html")) {
    document
      .querySelectorAll('a[href="#"], a:not([href]), a[href=""]')
      .forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.href = "/404.html";
        });
      });
  }
});

// Counter animation
function animateCounters() {
  document.querySelectorAll(".fun-fact-number").forEach((el) => {
    const target = +el.dataset.to;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  },
  { threshold: 0.3 },
);

const funFactsSection = document.querySelector(".fun-facts-area");
if (funFactsSection) observer.observe(funFactsSection);
