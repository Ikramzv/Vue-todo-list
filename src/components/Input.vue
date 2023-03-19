<script>
export default {
  data() {
    return {
      input: "",
      error: false,
      errorText: "",
    };
  },
  methods: {
    createTodo(e) {
      e.preventDefault();
      const exists = this.todos.some((todo) => todo.text === this.input);
      if (!!!this.input || exists) {
        this.error = true;
        this.errorText = this.input
          ? "Todo already exists"
          : "Please don't leave textarea empty";
        return;
      }
      this.todos.unshift({
        completed: this.activeFilter === "completed",
        text: this.input,
        id: crypto.randomUUID(),
      });
      this.input = "";
      localStorage.setItem("todos", JSON.stringify(this.todos));

      if (this.activeFilter === "recently-deleted") return;

      this.$emit("set-filtered-todos");
    },
  },
  mounted() {
    this.$refs.input.focus();
  },
  watch: {
    errorText(n, o, cleanUp) {
      let timeout;
      if (this.error) {
        timeout = setTimeout(() => {
          this.error = false;
          this.errorText = "";
        }, 1500);
      }

      cleanUp(() => {
        if (timeout) clearTimeout(timeout);
      });
    },
  },
  props: ["todos", "filteredTodos", "activeFilter"],
  emits: ["set-filtered-todos"],
};
</script>

<template>
  <div>
    <textarea
      type="text"
      @keyup.ctrl.enter.exact="createTodo"
      v-model="input"
      placeholder="add todo 'Ctrl' + 'Enter'"
      ref="input"
      :disabled="activeFilter === 'recently-deleted'"
    />
    <div class="alert-container" :class="error ? 'active' : ''">
      <p class="alert">{{ errorText }}</p>
    </div>
  </div>
</template>

<style scoped>
div:first-child {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
}

textarea {
  width: 70%;
  border: 1px solid rgb(187, 184, 184);
  transition: 200ms ease;
}

textarea:focus {
  border-color: gray;
  color: white;
  animation: shine 1s linear infinite alternate;
  caret-color: white;
}

textarea:focus::placeholder {
  color: white;
}

div.alert-container {
  position: fixed;
  right: 20px;
  top: 100px;
  transform: translateX(calc(100% + 30px));
  transition: 200ms cubic-bezier(0.27, 0.17, 0.69, 1.39);
  background-color: rgb(223, 103, 127);
  border: 1px solid crimson;
  border-radius: 12px;
  min-width: 20vw;
  padding: 8px 12px;
}

div.alert-container.active {
  transform: translateX(0);
}

.alert {
  color: rgb(94, 5, 23);
  text-align: center;
}
</style>

<style>
.container:has(div > textarea:focus) ul::after {
  content: "";
  position: absolute;
  inset: 0;
  animation: shine 750ms linear infinite alternate;
}

@keyframes shine {
  0% {
    background-color: rgba(0, 0, 0, 0);
  }
  25% {
    background-color: rgba(0, 0, 0, 0.1);
  }
  50% {
    background-color: rgba(0, 0, 0, 0.2);
  }
  75% {
    background-color: rgba(0, 0, 0, 0.3);
  }
  100% {
    background-color: rgba(0, 0, 0, 0.4);
  }
}
</style>
