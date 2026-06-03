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
  // ── Set active state in navigation ────────
  const currentPath = window.location.pathname;

  // Helper to normalize paths for consistent comparison
  function getCanonicalPath(urlPath) {
    // Remove trailing slash unless it's just "/"
    let path =
      urlPath.endsWith("/") && urlPath.length > 1
        ? urlPath.slice(0, -1)
        : urlPath;
    // Treat /index.html as /
    if (path.endsWith("/index.html")) {
      path = path.slice(0, -10); // Remove "/index.html"
      if (path === "") path = "/"; // If it becomes empty, it's the root
    }
    return path;
  }

  const canonicalCurrentPath = getCanonicalPath(currentPath);

  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    // Skip links that are just '#' or empty href
    if (link.getAttribute("href") === "#" || link.getAttribute("href") === "") {
      return;
    }
    const linkPath = new URL(link.href, window.location.origin).pathname;
    const canonicalLinkPath = getCanonicalPath(linkPath);

    if (canonicalCurrentPath === canonicalLinkPath) {
      link.classList.add("active");
    }
  });

  const navbar = document.querySelector(".navbar");
  function handleScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  attachDeadLinkRedirects();

  // Lock body scroll when mobile menu is open
  const navbarCollapse = document.querySelector(".navbar-collapse");
  if (navbarCollapse) {
    navbarCollapse.addEventListener("show.bs.collapse", () => {
      document.body.style.overflow = "hidden";
    });
    navbarCollapse.addEventListener("hide.bs.collapse", () => {
      document.body.style.overflow = "";
    });
  }
});

// Resolve correct 404 path from any page depth
function get404Path() {
  return isInSubdir ? "../404.html" : "404.html";
}

// Attach click redirect to all dead links (#, empty, missing href)
function attachDeadLinkRedirects() {
  if (window.location.pathname.includes("404.html")) return;
  const target = get404Path();
  document
    .querySelectorAll('a[href="#"], a:not([href]), a[href=""]')
    .forEach((link) => {
      if (link.dataset.deadLinked) return;
      link.dataset.deadLinked = "1";
      link.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = target;
      });
    });
}

// Re-run whenever new nodes are added to the DOM (e.g. injected header/footer links)
if (!window.location.pathname.includes("404.html")) {
  new MutationObserver(attachDeadLinkRedirects).observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initialize animations
attachAnimationsOnScroll();

// Counter animation
function animateCounters() {
  document
    .querySelectorAll(".fun-fact-number, .about-stat-number")
    .forEach((el) => {
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

document
  .querySelectorAll(".fun-facts-area, .about-stats-section")
  .forEach((section) => {
    observer.observe(section);
  });

// ── Animations on Scroll ─────────────────────
/**
 * Attaches Intersection Observers to elements with 'animate-on-scroll' class
 * to trigger Animate.css animations when they enter the viewport.
 */
function attachAnimationsOnScroll() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if (animatedElements.length === 0) {
    return; // No elements to observe
  }

  const animationObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationClass = element.dataset.animation;
          const animationDelay = element.dataset.delay;

          element.classList.add("animate__animated", animationClass);
          if (animationDelay) {
            element.style.setProperty("--animate-delay", animationDelay);
          }
          observer.unobserve(element); // Stop observing once animated
        }
      });
    },
    { threshold: 0.1 }, // Trigger when 10% of the element is visible
  );

  animatedElements.forEach((element) => {
    animationObserver.observe(element);
  });
}
