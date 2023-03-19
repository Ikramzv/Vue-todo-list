<script setup>
import { ref } from "vue";
import FilterTodos from "./components/FilterTodos.vue";
import Input from "./components/Input.vue";
import TodoList from "./components/TodoList.vue";

const todos = ref(JSON.parse(localStorage.getItem("todos")) || []);
const filteredTodos = ref([...todos.value]);
const activeFilter = ref("all");

function selectAll() {
  activeFilter.value = "all";
  filteredTodos.value = todos.value;
}
function selectCompleted(todos) {
  activeFilter.value = "completed";
  filteredTodos.value = todos;
}

function selectRecently(todos) {
  activeFilter.value = "recently-deleted";
  filteredTodos.value = todos;
}

function setFilteredTodos() {
  filteredTodos.value = todos.value.filter((item) => {
    if (activeFilter.value === "all") return true;
    return item.completed;
  });
}
</script>

<template>
  <div class="container">
    <Input
      :todos="todos"
      :filteredTodos="filteredTodos"
      :activeFilter="activeFilter"
      @set-filtered-todos="setFilteredTodos"
    />
    <FilterTodos
      :todos="todos"
      @select-all="selectAll"
      @select-completed="selectCompleted"
      @select-recently-deleted="selectRecently"
    />
    <TodoList
      :todos="todos"
      :filteredTodos="filteredTodos"
      :activeFilter="activeFilter"
      @set-filtered-todos="setFilteredTodos"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
  height: calc(100vh - 100px);
}
</style>

<script>
const str = "";
</script>
