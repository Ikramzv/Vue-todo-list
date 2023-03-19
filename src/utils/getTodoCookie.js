import deleteTodoCookie from "./deleteTodoCookie";

export default function getTodoCookie(todoId, allTodos) {
  const pair = document.cookie
    .split("; ")
    .find((cookie) => cookie.includes("todo"));

  if (!pair) return [];

  const [_, todosJson] = pair.split("=");
  const nonExpiredTodos = [];
  const todos = JSON.parse(todosJson);

  todos.forEach((todo) => {
    if (todo.expires < new Date()) deleteTodoCookie(todo.id);
    else nonExpiredTodos.push(todo);
  });

  if (allTodos) return nonExpiredTodos;
  return nonExpiredTodos.find((todo) => todo.id === todoId);
}
