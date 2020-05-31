const baseUrl = "https://todos-backend-bisasih.herokuapp.com/";
let count = 0;
$(document).ready(function () {
  $.getJSON(baseUrl).then(addTodos);
  $("#new-todo").submit(function (e) {
    e.preventDefault();
    $.post(baseUrl + "add", $(this).serialize())
      .then(function (item) {
        var newTodo = $(
          `<li class="todo-item" >` +
            item.data.todo +
            '<span class="delete"> <i class="fas fa-trash"></i>   </span> </li>'
        );
        newTodo.data("id", item.data.id);
        newTodo.data("completed", item.data.completed);
        if (item.data.completed) {
          newTodo.addClass("done");
        }
        $(".list").append(newTodo);
        $("#todo-input").val("");
        updateCounter(++count);
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  $(".list").on("click", "li", function (e) {
    $(this).toggleClass("done");
    updateTodo($(this));
  });

  $(".list").on("click", "span", function (e) {
    e.stopPropagation();
    removeTodo($(this).parent());
  });
});
function updateCounter(count) {
  document.getElementById("count").innerHTML =
    count <= 0 ? "Wohoo.. you have nothing to-do" : count + " things todo";
}
async function addTodos(todos) {
  filters = "";
  todos.forEach(function (item) {
    var newTodo = $(
      `<li class="todo-item" >` +
        item.todo +
        '<span class="delete"> <i class="fas fa-trash"></i>   </span> </li>'
    );
    newTodo.data("id", item.id);
    newTodo.data("completed", item.completed);
    if (item.completed) {
      newTodo.addClass("done");
    }
    $(".list").append(newTodo);
  });
  const incompletedTodos = todos.filter(function (todo) {
    return !todo.completed;
  });
  count = incompletedTodos.length;
  updateCounter(count);
}

function removeTodo(todo) {
  var clickedID = todo.data("id");
  var URL = baseUrl + clickedID;
  updateCounter(--count);
  $.ajax({
    method: "DELETE",
    url: URL,
  }).then(function (data) {
    todo.remove();
  });
}

function updateTodo(todo) {
  var URL = baseUrl + todo.data("id");
  var updateData = { completed: !todo.data("completed") };
  updateCounter(todo.hasClass("done") === true ? --count : ++count);
  $.ajax({
    method: "PUT",
    url: URL,
    data: updateData,
  });
}
