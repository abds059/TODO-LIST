let btn = document.getElementById("add-btn");
let tasks_list = document.getElementById("tasks");
let input_text = document.getElementById("input-text");

// For preventing double triggering on touch devices
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
  btn.addEventListener("touchend", add_tasks);
} else {
  btn.addEventListener("click", add_tasks);
}

function add_tasks() {
  let task = input_text.value.trim();

  if (task != "") {
    let li = document.createElement("li");

    let check_icon = document.createElement("img");
    check_icon.src = "/circle.png";
    check_icon.alt = "Unchecked";
    check_icon.style.width = "1.5em";
    check_icon.style.height = "1.5em";
    check_icon.style.cursor = "pointer";

    let task_text = document.createElement("span");
    task_text.textContent = task;
    task_text.classList.add("task_text");

    let del_task = document.createElement("span");
    let del_icon = document.createElement("img");
    del_icon.src = "/cross.png";
    del_icon.alt = "Delete";
    del_icon.style.width = "1.5em";
    del_icon.style.height = "1.5em";
    del_icon.style.cursor = "pointer";

    del_task.appendChild(del_icon);

    li.appendChild(check_icon);
    li.appendChild(task_text);
    li.appendChild(del_task);
    tasks_list.appendChild(li);

    // Add appropriate event listeners based on device type
    if (isTouchDevice) {
      check_icon.addEventListener("touchend", function(e) {
        e.preventDefault(); 
        mark_done(check_icon, task_text);
      });
      
      del_task.addEventListener("touchend", function(e) {
        e.preventDefault(); 
        delete_task(li);
      });
    } 
    else {
      check_icon.addEventListener("click", function() {
        mark_done(check_icon, task_text);
      });
      
      del_task.addEventListener("click", function() {
        delete_task(li);
      });
    }
  }

  input_text.value = "";
  save_tasks();
}

function delete_task(li) {
  li.remove();
  save_tasks();
}

function mark_done(check_icon, task_text) {
  if (check_icon.src.includes("circle.png")) {
    check_icon.src = "/success.png";
    task_text.style.textDecoration = "line-through";
  } 
  else {
    check_icon.src = "/circle.png";
    task_text.style.textDecoration = "none";
  }
  save_tasks();
}

function save_tasks() {
  localStorage.setItem("tasks", tasks_list.innerHTML);
}

function display_savedtasks() {
  if (localStorage.getItem("tasks")) {
    tasks_list.innerHTML = localStorage.getItem("tasks");
    
    // Reattach event listeners to loaded elements
    const checkIcons = tasks_list.querySelectorAll("img[src*='circle.png'], img[src*='success.png']");
    const deleteButtons = tasks_list.querySelectorAll("span img[src*='cross.png']");
    
    if (isTouchDevice) {
      checkIcons.forEach(icon => {
        const taskText = icon.nextElementSibling;
        icon.addEventListener("touchend", function(e) {
          e.preventDefault();
          mark_done(icon, taskText);
        });
      });
      
      deleteButtons.forEach(button => {
        const li = button.parentElement.parentElement;
        button.parentElement.addEventListener("touchend", function(e) {
          e.preventDefault();
          delete_task(li);
        });
      });
    } else {
      checkIcons.forEach(icon => {
        const taskText = icon.nextElementSibling;
        icon.addEventListener("click", function() {
          mark_done(icon, taskText);
        });
      });
      
      deleteButtons.forEach(button => {
        const li = button.parentElement.parentElement;
        button.parentElement.addEventListener("click", function() {
          delete_task(li);
        });
      });
    }
  }
}

// Add a small delay to prevent touchstart and click from both firing
function touchHandler(event) {
  // Prevent mouseclick from triggering after touchend
  event.preventDefault();
}

// Initialize the app
display_savedtasks();