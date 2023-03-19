<script>
import getTodoCookie from "../utils/getTodoCookie";

export default {
  props: ["todos"],
  data() {
    return {
      active: "all",
    };
  },
  methods: {
    selectAllTodos() {
      if (this.active === "all") return;
      this.$emit("select-all");
      this.active = "all";
    },
    selectCompletedTodos() {
      if (this.active === "completed") return;
      const completed = this.todos.filter((todo) => todo.completed);
      this.$emit("select-completed", completed);
      this.active = "completed";
    },
    selectRecentlyDeletedTodos() {
      if (this.active === "recently-deleted") return;
      const recentlyDeletedTodos = getTodoCookie(null, true);
      this.$emit("select-recently-deleted", recentlyDeletedTodos);
      this.active = "recently-deleted";
    },
  },
  emits: ["select-all", "select-completed", "select-recently-deleted"],
};
</script>

<template>
  <div>
    <button
      class="all-todos-btn"
      :class="active === 'all' ? 'active' : ''"
      @click="selectAllTodos"
    >
      All
    </button>
    <button
      class="completed-todos-btn"
      :class="active === 'completed' ? 'active' : ''"
      @click="selectCompletedTodos"
    >
      Completed
    </button>
    <button
      class="recently-deleted-todos-btn"
      :class="active === 'recently-deleted' ? 'active' : ''"
      @click="selectRecentlyDeletedTodos"
    >
      Recently Deleted
    </button>
  </div>
</template>

<style scoped>
div {
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 10px;
  padding: 8px 12px;
  background-color: white;
  border-radius: 12px;
  width: 85%;
  margin: 0 auto;
}

button.all-todos-btn {
  --color: black;
}
button.completed-todos-btn {
  --color: rgb(38, 181, 38);
}
button.recently-deleted-todos-btn {
  --color: crimson;
}

button.active {
  background-color: var(--color);
  color: white;
}

button {
  transition: 200ms ease;
  background-color: white;
  border: 1px solid var(--color);
  color: var(--color);
}

button:active {
  scale: 0.9;
}

button:hover {
  background-color: var(--color);
  color: white;
}
</style>
