// dashboard-common.js — shared sidebar + topbar init

const roleConfig = {
  patient: {
    icon: "fa-user-injured",
    nav: [
      {
        section: "Main",
        items: [
          { icon: "fa-gauge", label: "Dashboard", href: "dashboard.html" },
          {
            icon: "fa-calendar-check",
            label: "Appointments",
            href: "appointments.html",
            badge: "3",
          },
          {
            icon: "fa-file-medical",
            label: "Medical Records",
            href: "medical-records.html",
          },
        ],
      },
      {
        section: "Health",
        items: [
          {
            icon: "fa-pills",
            label: "Prescriptions",
            href: "prescriptions.html",
          },
          { icon: "fa-heart-pulse", label: "Vitals", href: "vitals.html" },
          {
            icon: "fa-notes-medical",
            label: "Health Notes",
            href: "health-notes.html",
          },
        ],
      },
      {
        section: "Account",
        items: [
          { icon: "fa-user", label: "My Profile", href: "profile.html" },
          {
            icon: "fa-bell",
            label: "Notifications",
            href: "notifications.html",
          },
          { icon: "fa-gear", label: "Settings", href: "settings.html" },
        ],
      },
    ],
  },
  doctor: {
    icon: "fa-user-doctor",
    nav: [
      {
        section: "Main",
        items: [
          { icon: "fa-gauge", label: "Dashboard", href: "dashboard.html" },
          {
            icon: "fa-calendar-day",
            label: "Schedule",
            href: "appointments.html",
            badge: "8",
          },
          { icon: "fa-users", label: "Patients", href: "patients.html" },
        ],
      },
      {
        section: "Clinical",
        items: [
          {
            icon: "fa-file-waveform",
            label: "Reports",
            href: "reports.html",
            badge: "6",
          },
          {
            icon: "fa-prescription",
            label: "Prescriptions",
            href: "prescriptions.html",
          },
          {
            icon: "fa-notes-medical",
            label: "Clinical Notes",
            href: "health-notes.html",
          },
        ],
      },
      {
        section: "Account",
        items: [
          { icon: "fa-user", label: "My Profile", href: "profile.html" },
          {
            icon: "fa-bell",
            label: "Notifications",
            href: "notifications.html",
          },
          { icon: "fa-gear", label: "Settings", href: "settings.html" },
        ],
      },
    ],
  },
  staff: {
    icon: "fa-user-nurse",
    nav: [
      {
        section: "Main",
        items: [
          { icon: "fa-gauge", label: "Dashboard", href: "dashboard.html" },
          {
            icon: "fa-calendar-check",
            label: "Appointments",
            href: "appointments.html",
          },
          { icon: "fa-users", label: "Patients", href: "patients.html" },
        ],
      },
      {
        section: "Ops",
        items: [
          { icon: "fa-file-invoice", label: "Reports", href: "reports.html" },
          {
            icon: "fa-notes-medical",
            label: "Health Notes",
            href: "health-notes.html",
          },
          {
            icon: "fa-pills",
            label: "Prescriptions",
            href: "prescriptions.html",
          },
        ],
      },
      {
        section: "Account",
        items: [
          { icon: "fa-user", label: "My Profile", href: "profile.html" },
          {
            icon: "fa-bell",
            label: "Notifications",
            href: "notifications.html",
          },
          { icon: "fa-gear", label: "Settings", href: "settings.html" },
        ],
      },
    ],
  },
  admin: {
    icon: "fa-user-shield",
    nav: [
      {
        section: "Overview",
        items: [
          { icon: "fa-gauge", label: "Dashboard", href: "dashboard.html" },
          {
            icon: "fa-users-gear",
            label: "User Management",
            href: "user-management.html",
          },
          { icon: "fa-chart-bar", label: "Analytics", href: "analytics.html" },
        ],
      },
      {
        section: "Clinical",
        items: [
          {
            icon: "fa-calendar-check",
            label: "Appointments",
            href: "appointments.html",
          },
          { icon: "fa-users", label: "Patients", href: "patients.html" },
          {
            icon: "fa-file-medical",
            label: "Medical Records",
            href: "medical-records.html",
          },
          {
            icon: "fa-pills",
            label: "Prescriptions",
            href: "prescriptions.html",
          },
          { icon: "fa-heart-pulse", label: "Vitals", href: "vitals.html" },
          {
            icon: "fa-notes-medical",
            label: "Health Notes",
            href: "health-notes.html",
          },
        ],
      },
      {
        section: "Reports",
        items: [
          { icon: "fa-file-waveform", label: "Reports", href: "reports.html" },
        ],
      },
      {
        section: "Account",
        items: [
          { icon: "fa-user", label: "My Profile", href: "profile.html" },
          {
            icon: "fa-bell",
            label: "Notifications",
            href: "notifications.html",
          },
          { icon: "fa-gear", label: "Settings", href: "settings.html" },
        ],
      },
    ],
  },
};

function getNameAndInitials(email) {
  const namePart = email
    .split("@")[0]
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const initials = namePart
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return { namePart, initials };
}

function initSidebar(user, activeLabel) {
  const cfg = roleConfig[user.role] || roleConfig.patient;
  const { namePart, initials } = getNameAndInitials(user.email);
  const currentPage =
    window.location.pathname.split("/").pop() || "dashboard.html";

  const aside = document.getElementById("sidebar");
  aside.innerHTML = `
    <div class="db-sidebar-logo">
      <div class="logo-icon"><i class="fas fa-plus-circle"></i></div>
      <span>Stack<em>ly</em></span>
    </div>
    <nav class="db-nav" id="sidebarNav"></nav>
    <div class="db-sidebar-user">
      <div class="avatar">${initials}</div>
      <div class="info">
        <div class="name">${namePart}</div>
        <div class="role-tag">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
      </div>
      <button class="logout-btn" title="Logout" onclick="logout()">
        <i class="fas fa-right-from-bracket"></i>
      </button>
    </div>`;

  const nav = document.getElementById("sidebarNav");
  cfg.nav.forEach((group) => {
    const sec = document.createElement("div");
    sec.className = "db-nav-section";
    sec.innerHTML = `<div class="db-nav-label">${group.section}</div>`;
    group.items.forEach((item) => {
      const a = document.createElement("a");
      const isActive = item.label === activeLabel || item.href === currentPage;
      a.className = "db-nav-item" + (isActive ? " active" : "");
      a.href = item.href || "#";
      a.innerHTML = `<i class="fas ${item.icon}"></i> ${item.label}${item.badge ? `<span class="badge-pill">${item.badge}</span>` : ""}`;
      sec.appendChild(a);
    });
    nav.appendChild(sec);
  });
}

function initTopbar(user) {
  const { namePart, initials } = getNameAndInitials(user.email);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  document.getElementById("topbarSub").textContent = today;
  document.getElementById("topbarAvatar").textContent = initials;
  document.getElementById("topbarName").textContent = namePart;
}

function logout() {
  sessionStorage.removeItem("user");
  window.location.href = "login.html";
}

// Intercept # / empty links AND buttons marked data-nav="404"
function handle404Links() {
  document.addEventListener("click", function (e) {
    // <a> with # or no href
    const link = e.target.closest("a");
    if (link) {
      const href = link.getAttribute("href");
      if (!href || href === "#" || href === "javascript:void(0)") {
        e.preventDefault();
        window.location.href = "404.html";
        return;
      }
    }
    // <button data-nav="404">
    const btn = e.target.closest('button[data-nav="404"]');
    if (btn) {
      e.preventDefault();
      window.location.href = "404.html";
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", handle404Links);
} else {
  handle404Links();
}
