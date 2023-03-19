import getTodoCookie from "./getTodoCookie";

export default function deleteTodoCookie(todoId) {
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 30); // 30 minutes
  const expires = date.toUTCString();
  const todos = getTodoCookie(null, true);
  const updated = todos.filter((todo) => todo.id !== todoId);
  document.cookie = `todos=${JSON.stringify(updated)}; expires=${expires}`;
}
