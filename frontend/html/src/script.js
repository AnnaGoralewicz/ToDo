function loadToDos() {
  fetch("/api")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayToDos(data);
    });
}

function displayToDos(data) {
  let table = document.getElementById("todolist");

  console.log(data.todos);
  data.todos.forEach((e) => {
    console.log(e);
    let td = document.createElement("tr");
    td.innerHTML = '<td><input type="checkbox" name="task" ${
      e.done ? "checked" : ""
    }></td> <td>${e.text}</td> 
    <td><button>Edit</button><button>Delete</button></td>';
    table.appendChild(td);
  });
}
