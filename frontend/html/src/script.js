const endpoint = "http://localhost:3000";

function loadToDos() {
  fetch(endpoint + "/list")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayToDos(data);
    })
    .catch((err) => console.log(err));
}

function displayToDos(data) {
  let table = document.getElementById("todolist");
  table.innerHTML = "";
  let tableDone = document.getElementById("todolist_done");
  tableDone.innerHTML = "";

  console.log(data.todos);
  data.todos
    .filter((e) => !e.done)
    .forEach((e) => {
      console.log(e);
      let td = document.createElement("tr");
      td.innerHTML = `<td><button id="${e.id}">Delete</button></td>
     <td><input id="i_${e.id}" type="text" value="${e.description}" /></td> 
    <td><input id="c_${e.id}" type="checkbox" name="task" ${
        e.done ? "checked" : ""
      }></td>`;
      table.appendChild(td);
      document
        .getElementById("c_" + e.id)
        .addEventListener("click", (event) => updateItem(e.id));
      document
        .getElementById(e.id)
        .addEventListener("click", () => deleteItem(e.id));
      document
        .getElementById("i_" + e.id)
        .addEventListener("focusout", (event) => {
          updateItem(e.id);
        });
    });

  data.todos
    .filter((e) => e.done)
    .forEach((e) => {
      console.log(e);
      let td = document.createElement("tr");
      td.innerHTML = `<td><button id="${e.id}" >Delete</button></td>
     <td><input id="i_${e.id}" type="text" value="${e.description}" /></td> 
    <td><input id="c_${e.id}" type="checkbox" name="task " ${
        e.done ? "checked" : ""
      }></td>`;
      tableDone.appendChild(td);
      document
        .getElementById("c_" + e.id)
        .addEventListener("click", (event) => updateItem(e.id));
      document
        .getElementById(e.id)
        .addEventListener("click", () => deleteItem(e.id));
      document
        .getElementById("i_" + e.id)
        .addEventListener("focusout", (event) => {
          updateItem(e.id);
        });
    });
}

async function addNewItem() {
  let newItem = {
    description: document.getElementById("task").value,
  };
  const response = await fetch(endpoint + "/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newItem),
  });
  console.log(response.body);
  loadToDos();
}

async function deleteItem(id) {
  let item = {
    id: id,
  };
  console.log("delete", item);
  const response = await fetch(endpoint + "/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  console.log(response.body);
  loadToDos();
}

async function updateItem(id) {
  let item = {
    id: id,
    description: document.getElementById("i_" + id).value,
    done: document.getElementById("c_" + id).checked,
  };
  console.log("update", item);
  const response = await fetch(endpoint + "/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  console.log(response.body);
  loadToDos();
}
