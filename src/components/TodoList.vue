<script lang="js">
import deleteTodoCookie from "../utils/deleteTodoCookie";
import setTodoCookie from "../utils/setTodoCookie";
import TodoItem from "./TodoItem.vue";

const intersection = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("intersects", entry.isIntersecting);
    });
  },
  {
    threshold: 0.3,
  }
);

export default {
  props: ["todos","filteredTodos","activeFilter"],
  components: {
    TodoItem,
  },
  data() {
    return {
      observer: intersection
    }
  },
  methods: {
    updateTodo(todoId,prop,newValue) {
      const index = this.todos.findIndex((todo) => todo.id === todoId)
      const updated = {...this.todos[index], [prop]: newValue}
      this.todos.splice(index,1,updated)
      localStorage.setItem("todos",JSON.stringify(this.todos))
      this.$emit("set-filtered-todos")
    },
    deleteTodo(todo) {
      setTimeout(() => {
        const index = this.todos.findIndex((item) => item.id === todo.id);
        this.todos.splice(index, 1);
        localStorage.setItem("todos", JSON.stringify(this.todos));
        setTodoCookie(todo)
        this.$emit("set-filtered-todos")
      }, 250)
    },
    editTodo(todoId,text) {
      this.updateTodo(todoId,"text",text)
    },
    makeCompleted(todoId,isCompleted) {
      this.updateTodo(todoId,"completed",isCompleted)
    },
    restoreTodo({expires, ...todo}) {
      deleteTodoCookie(todo.id)
      const index = this.filteredTodos.findIndex((item) => item.id === todo.id);
      this.filteredTodos.splice(index, 1);
      this.todos.unshift(todo)
      localStorage.setItem("todos", JSON.stringify(this.todos))
    },
    removeTodo({expires,...todo}) {
      setTimeout(() => {
        deleteTodoCookie(todo.id)
        const index = this.filteredTodos.findIndex((item) => item.id === todo.id);
        this.filteredTodos.splice(index, 1);
      } , 250)
    }
  },
  computed: {
    notFoundText() {
      let middleText = ''
      if(this.activeFilter === "completed") middleText = 'completed'
      else if ( this.activeFilter === "recently-deleted") middleText = 'recently-deleted'

      return `There are no ${middleText} todos`
    }
  },
  emits: ["set-filtered-todos"]
};
</script>

<template>
  <ul>
    <todo-item
      v-for="todo of filteredTodos"
      :todo="todo"
      @delete-todo="deleteTodo"
      @edit-todo="editTodo"
      @make-completed="makeCompleted"
      @restore-todo="restoreTodo"
      @remove-todo="removeTodo"
      :key="todo.id"
      :observer="observer"
      :activeFilter="activeFilter"
      ref="listItem"
    />
    <p class="not-found" v-if="!filteredTodos.length">
      {{ notFoundText }}
    </p>
  </ul>
</template>

<style scoped>
ul {
  max-height: 70vh;
  width: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 20px;
  position: relative;
  border-radius: 12px;
}

ul::-webkit-scrollbar {
  display: block;
  width: 10px;
}

ul::-webkit-scrollbar-track {
  background-color: black;
  border-radius: 12px;
}

ul::-webkit-scrollbar-thumb {
  background-color: white;
  border: 3px solid black;
  border-radius: 12px;
}

.not-found {
  color: crimson;
  background-color: white;
  border-radius: 8px;
  padding: 8px 12px;
  width: max-content;
  margin-inline: auto;
}
</style>
