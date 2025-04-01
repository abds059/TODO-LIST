let btn = document.getElementById("add-btn");
let tasks_list = document.getElementById("tasks");
let input_text = document.getElementById("input-text");

// For preventing double triggering on touch devices
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Add a small delay between touch actions to prevent double triggering
let lastTouchTime = 0;
const touchDelay = 300; // milliseconds

btn.addEventListener("click", function(e) {
  if (isTouchDevice && Date.now() - lastTouchTime < touchDelay) {
    return; // Ignore click if it follows a recent touch
  }
  add_tasks();
});

// Handle touch separately with a delay
if (isTouchDevice) {
  btn.addEventListener("touchend", function(e) {
    e.preventDefault();
    lastTouchTime = Date.now();
    add_tasks();
  });
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
    // Remove hover styling for mobile
    if (isTouchDevice) {
      check_icon.classList.add("touch-icon");
    }

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
    // Remove hover styling for mobile
    if (isTouchDevice) {
      del_icon.classList.add("touch-icon");
    }

    del_task.appendChild(del_icon);

    li.appendChild(check_icon);
    li.appendChild(task_text);
    li.appendChild(del_task);
    tasks_list.appendChild(li);

    // Handle click events with touch detection
    check_icon.addEventListener("click", function(e) {
      if (isTouchDevice && Date.now() - lastTouchTime < touchDelay) {
        return; 
      }
      mark_done(check_icon, task_text);
    });
    
    del_task.addEventListener("click", function(e) {
      if (isTouchDevice && Date.now() - lastTouchTime < touchDelay) {
        return; 
      }
      delete_task(li);
    });

    // Handle touch events separately
    if (isTouchDevice) {
      check_icon.addEventListener("touchend", function(e) {
        e.preventDefault();
        e.stopPropagation();
        lastTouchTime = Date.now();
        mark_done(check_icon, task_text);
      });
      
      del_task.addEventListener("touchend", function(e) {
        e.preventDefault();
        e.stopPropagation();
        lastTouchTime = Date.now();
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
  // Disable the icon temporarily to prevent multiple triggers
  check_icon.style.pointerEvents = "none";
  
  setTimeout(() => {
    if (check_icon.src.includes("circle.png")) {
      check_icon.src = "/success.png";
      task_text.style.textDecoration = "line-through";
    } else {
      check_icon.src = "/circle.png";
      task_text.style.textDecoration = "none";
    }
    save_tasks();
    
    // Re-enable the icon after a short delay
    setTimeout(() => {
      check_icon.style.pointerEvents = "auto";
    }, 300);
  }, 10);
}

function save_tasks() {
  localStorage.setItem("tasks", tasks_list.innerHTML);
}

function display_savedtasks() {
  if (localStorage.getItem("tasks")) {
    tasks_list.innerHTML = localStorage.getItem("tasks");
    
    // Add touch-icon class to existing icons if on touch device
    if (isTouchDevice) {
      const allIcons = tasks_list.querySelectorAll("img");
      allIcons.forEach(icon => {
        icon.classList.add("touch-icon");
      });
    }
    
    // Reattach event listeners to loaded elements
    const checkIcons = tasks_list.querySelectorAll("img[src*='circle.png'], img[src*='success.png']");
    const deleteButtons = tasks_list.querySelectorAll("span img[src*='cross.png']");
    
    checkIcons.forEach(icon => {
      const taskText = icon.nextElementSibling;
      
      icon.addEventListener("click", function(e) {
        if (isTouchDevice && Date.now() - lastTouchTime < touchDelay) {
          return;
        }
        mark_done(icon, taskText);
      });
      
      if (isTouchDevice) {
        icon.addEventListener("touchend", function(e) {
          e.preventDefault();
          e.stopPropagation();
          lastTouchTime = Date.now();
          mark_done(icon, taskText);
        });
      }
    });
    
    deleteButtons.forEach(button => {
      const li = button.parentElement.parentElement;
      
      button.parentElement.addEventListener("click", function(e) {
        if (isTouchDevice && Date.now() - lastTouchTime < touchDelay) {
          return;
        }
        delete_task(li);
      });
      
      if (isTouchDevice) {
        button.parentElement.addEventListener("touchend", function(e) {
          e.preventDefault();
          e.stopPropagation();
          lastTouchTime = Date.now();
          delete_task(li);
        });
      }
    });
  }
}

// Initialize the app
display_savedtasks();