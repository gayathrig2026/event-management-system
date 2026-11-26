/* Logged-in and logged-out navigation. Demo accounts live in this browser. */
(function () {
  function mount() {
    if (!window.Vayora || !document.querySelector) return;
    var cta = document.querySelector(".site-header .nav-cta");
    if (!cta || cta.dataset.authBound === "true") return;
    cta.dataset.authBound = "true";

    var session = Vayora.getSession();
    var actions = document.createElement("div");
    actions.className = "nav-actions";
    cta.parentNode.insertBefore(actions, cta);
    actions.appendChild(cta);

    if (!session) {
      cta.textContent = "Login";
      cta.href = "login.html";
      if (!cta.classList.contains("active") && /login\.html$/i.test(window.location.pathname)) {
        cta.classList.add("active");
      }
      var signup = document.createElement("a");
      signup.className = "nav-cta nav-signup";
      signup.href = "login.html?mode=register";
      signup.textContent = "Sign Up";
      actions.appendChild(signup);
      return;
    }

    cta.hidden = true;
    var initial = String(session.name || "U").trim().charAt(0).toUpperCase() || "U";
    var menu = document.createElement("div");
    menu.className = "profile-menu";

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "profile-trigger";
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");
    trigger.innerHTML =
      '<span class="profile-avatar" aria-hidden="true"></span>' +
      '<span class="profile-name"></span>';
    trigger.querySelector(".profile-avatar").textContent = initial;
    trigger.querySelector(".profile-name").textContent = session.name;

    var dropdown = document.createElement("div");
    dropdown.className = "profile-dropdown";
    dropdown.setAttribute("role", "menu");

    function item(tag, href, label) {
      var element = document.createElement(tag);
      element.textContent = label;
      element.setAttribute("role", "menuitem");
      if (href) element.href = href;
      else element.type = "button";
      dropdown.appendChild(element);
      return element;
    }

    item("a", "profile.html", "My Profile");
    item("a", "my-events.html", "My Events");
    var logout = item("button", "", "Logout");
    logout.addEventListener("click", function () {
      Vayora.logout();
      window.location.href = "index.html";
    });

    trigger.addEventListener("click", function (event) {
      event.stopPropagation();
      var open = menu.classList.toggle("open");
      trigger.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", function () {
      menu.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        menu.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    menu.append(trigger, dropdown);
    actions.appendChild(menu);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
