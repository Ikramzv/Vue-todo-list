<script>
import Expires from "./Expires.vue";

export default {
  props: ["todo", "editTodo", "observer", "activeFilter"],
  components: {
    Expires,
  },
  data() {
    return {
      checkbox: this.todo.completed,
      isEditing: false,
      input: this.todo.text,
    };
  },
  methods: {
    handleDelete(e, todo) {
      if (this.activeFilter === "recently-deleted")
        return this.removeTodo(todo);

      this.$emit("delete-todo", todo);
      this.$refs.li.classList.remove("intersects");
    },
    handleEdit(cancel, todo) {
      if (this.activeFilter === "recently-deleted") {
        return this.restoreTodo(todo);
      }

      if (cancel) return (this.isEditing = false);
      if (this.isEditing) this.saveEdit(todo);
      else this.startEdit();
    },
    saveEdit(todo) {
      if (this.input === todo.text) {
        return (this.isEditing = false);
      }
      this.$emit("edit-todo", todo.id, this.input);
      this.isEditing = false;
    },
    startEdit() {
      this.isEditing = true;
      this.$nextTick(() => {
        this.$refs.textarea.focus();
      });
    },
    restoreTodo(todo) {
      this.$emit("restore-todo", todo);
    },
    removeTodo(todo) {
      this.$refs.li.classList.remove("intersects");
      this.$emit("remove-todo", todo);
    },
  },
  computed: {
    editButtonText() {
      if (this.activeFilter === "recently-deleted") return "Restore";
      return this.isEditing ? "Save Edit" : "Edit";
    },
    deleteButtonText() {
      return this.activeFilter === "recently-deleted" ? "Remove" : "Delete";
    },
  },
  watch: {
    checkbox(newValue) {
      this.$emit("make-completed", this.todo.id, newValue);
    },
  },
  mounted() {
    this.observer.observe(this.$refs.li);
  },
  emits: [
    "delete-todo",
    "edit-todo",
    "make-completed",
    "restore-todo",
    "remove-todo",
  ], // Optionally
};
</script>

<template>
  <li ref="li">
    <div class="info-container">
      <div class="info" v-if="activeFilter === 'recently-deleted'">
        <button
          class="info-button"
          @click="(e) => e.target.classList.toggle('show-info')"
        >
          i
        </button>
        <div class="show-info-container">
          <button
            class="close"
            @click="
              (e) =>
                e.target.parentElement.previousElementSibling.classList.remove(
                  'show-info'
                )
            "
          >
            Close
          </button>
          <table>
            <thead>
              <th>Expires</th>
              <th>Id</th>
            </thead>
            <tbody>
              <tr>
                <Expires :expires="todo.expires" />
              </tr>
              <tr>
                {{
                  todo.id
                }}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <input
        type="checkbox"
        v-model="checkbox"
        :disabled="activeFilter === 'recently-deleted'"
      />
    </div>
    <p v-if="!isEditing">{{ todo.text }}</p>
    <textarea v-else v-model="input" cols="30" rows="5" ref="textarea" />

    <div class="actions">
      <button @click="handleDelete($event, todo)" class="delete">
        {{ deleteButtonText }}
      </button>
      <button @click="handleEdit(false, todo)" class="edit">
        {{ editButtonText }}
      </button>
      <button v-if="isEditing" class="cancel" @click="handleEdit(true, todo)">
        Cancel Edit
      </button>
    </div>
  </li>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  color: black;
  overflow: hidden;
  max-height: 150px;
  margin-block: 10px;
  padding-block: 8px;
  transition: 200ms ease;
  opacity: 0;
  position: relative;
}

li button {
  border: 2px solid var(--color);
  transition: 200ms ease;
  width: var(--width);
  color: var(--color);
}

li button:hover {
  background-color: var(--color);
  color: var(--hover-color, white);
}

li button:active {
  scale: 0.9;
}

li:nth-child(odd) {
  transform: translateX(50%);
}
li:nth-child(even) {
  transform: translateX(-50%);
}

li.intersects {
  transform: translateX(0px);
  opacity: 1;
}

li > .info-container:first-child {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  margin-inline: 12px;
}

li > .info-container > .info > .info-button {
  --width: 100%;
  --color: rgb(14, 14, 101);
  font-size: 16px;
}
li > .info-container > .info > .show-info-container {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 80%;
  z-index: 10;
  background-color: black;
  clip-path: circle(0% at 0px 100%);
  transition: 200ms ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding: 6px 10px 10px;
  box-shadow: 2px 0px 5px 0 black;
}

li > .info-container > .info > .show-info-container > .close {
  --color: white;
  --hover-color: black;
  --width: max-content;
  align-self: flex-end;
  margin: 6px 6px 0 0;
}

li > .info-container > .info > .info-button.show-info + .show-info-container {
  clip-path: circle(150% at 0px 100%);
}

table::-webkit-scrollbar {
  display: block;
  width: 4px;
}
table::-webkit-scrollbar-track {
  background-color: black;
  border-radius: 12px;
}
table::-webkit-scrollbar-thumb {
  background-color: white;
  border-radius: 12px;
}

table {
  overflow: auto;
}

th,
tr {
  border: 1px solid white;
  color: white;
  font-size: 14px;
  flex: 1;
  text-align: center;
  padding: 4px 6px;
}

tr {
  height: 40px;
  overflow: auto;
}

tbody {
  display: flex;
}

thead {
  display: flex;
  align-items: center;
}

li > .info-container > input {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: 200ms ease;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid crimson;
}

li > .info-container > input:disabled {
  background-color: gray;
  border-color: gray;
  opacity: 0.7;
}

li > .info-container > input:not(:disabled):hover {
  translate: 0px -3px;
}

li > .info-container > input:not(:disabled):active {
  scale: 0.9;
}

li > .info-container > input:not(:disabled):checked {
  background-color: rgb(38, 181, 38);
  border-color: transparent;
}

li > .info-container > input:not(:disabled):checked::after {
  content: "+";
  color: white;
  position: absolute;
  transition: 100ms ease;
  font-size: 16px;
}

li > :is(p, textarea) {
  flex: 1;
  max-height: 125px;
  overflow-y: auto;
  overflow-x: hidden;
  --scroll-color: rgb(51, 46, 46);
  padding-inline: 6px;
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-line;
}

li > p::-webkit-scrollbar {
  display: block;
  height: 9px;
  width: 9px;
}

li > p::-webkit-scrollbar-track {
  background-color: var(--scroll-color);
  border-radius: 12px;
}

li > p::-webkit-scrollbar-thumb {
  background-color: white;
  border-radius: 12px;
  border: 2px solid var(--scroll-color);
}

li > .actions > :is(button.delete, button.cancel) {
  --color: crimson;
}
li > .actions > button.edit {
  --color: rgb(48, 177, 220);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-inline: 12px;
}

li > .actions > button {
  border: 1px solid var(--color);
  color: var(--color);
  font-size: 14px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: 200ms ease;
  cursor: pointer;
  background-color: transparent;
}

li > .actions > button:hover {
  background-color: var(--color);
  color: white;
}

li > .actions > button:active {
  transform: scale(0.95);
}
</style>
