import getTodoCookie from "./getTodoCookie";

export default function setTodoCookie(todo) {
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 30); // 30 minutes
  const expires = date.toUTCString();
  todo["expires"] = expires;
  const todos = getTodoCookie(null, true);
  todos.push(todo);
  document.cookie = `todos=${JSON.stringify(todos)}; expires=${expires}`;
  return todos;
}
