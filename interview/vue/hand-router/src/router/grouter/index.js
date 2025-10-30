import { ref, computed, h, inject } from "vue";
import RouterLink from "./RouterLink.vue";
import RouterView from "./RouterView.vue";

const ROUTER_KEY = "__router__";

class Router {
  constructor(options) {
    this.routes = Array.isArray(options?.routes) ? options.routes : [];
    this.history = options?.history || createWebHistory();
    this.currentPath = ref(getCurrentPath());
    this._onPopState = () => {
      this.currentPath.value = getCurrentPath();
    };
    window.addEventListener("popstate", this._onPopState);
  }

  push(path) {
    if (typeof path !== "string") return;
    if (path === this.currentPath.value) return;
    window.history.pushState({}, "", path);
    this.currentPath.value = getCurrentPath();
  }

  resolveComponent() {
    const match = this.routes.find((r) => r.path === this.currentPath.value);
    return match ? match.component : null;
  }

  install(app) {
    const self = this;
    app.config.globalProperties.$router = self;

    app.component("router-link", {
      props: { to: { type: String, required: true } },
      setup(props, { slots }) {
        const navigate = (e) => {
          e?.preventDefault?.();
          self.push(props.to);
        };
        return () =>
          h(
            "a",
            { href: props.to, onClick: navigate },
            slots.default ? slots.default() : props.to
          );
      },
    });

    app.component("router-view", {
      setup() {
        const component = computed(() => self.resolveComponent());
        return () => {
          const Comp = component.value;
          return Comp ? h(Comp) : null;
        };
      },
    });
  }
}

function getCurrentPath() {
  return window.location.pathname || "/";
}

function createRouter(options) {
  return new Router(options);
}

function createWebHistory() {
  return { type: "web" };
}

function useRouter() {
  return inject(ROUTER_KEY);
}

export { createRouter, createWebHistory, useRouter };
