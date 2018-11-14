class Vun {
  constructor() {}

  static component(name, options) {
    return customElements.define(
      name,
      class Component extends HTMLElement {
        static get observedAttributes() {
          return options.props;
        }

        constructor() {
          super();

          Object.assign(this, options);

          this.lifeHookAction("beforeCreate");
          this.view = this.attachShadow({ mode: "open" });
          this.$data = this.data();
          for (let key in this.$data) {
            Object.defineProperties(this, {
              [key]: {
                get: () => {
                  return this.$data[key];
                },
                set: i => {
                  this._render();
                  this.$data[key] = i;
                  return i;
                }
              }
            });
          }
          this.lifeHookAction("created");
          this.view.innerHTML = this.render();
          this.lifeHookAction("beforeMount");
        }

        lifeHookAction(actionName, ...opts) {
          return this[actionName] && this[actionName](...opts);
        }

        _render() {
          if (this.lifeHookAction("beforeUpdate")) {
            this.view.innerHTML = this.render();
            this.lifeHookAction("updated");
          }
        }

        attributeChangedCallback(name, oldValue, newValue) {
          this._render();
        }

        connectedCallback() {
          this.lifeHookAction("mounted");
        }

        disconnectedCallback() {
          this.lifeHookAction("beforeDestroy");
          this.lifeHookAction("destroyed");
        }

        adoptedCallback() {
          console.log("Custom square element moved to new page.");
        }
      }
    );
  }
}
