document.addEventListener("DOMContentLoaded", function () {
  const addTask = document.getElementById("add-task");
  const taskContainer = document.getElementById("task-container");
  const inputTask = document.getElementById("input-task");
  const errorMessage = document.getElementById("error-message");
  const emptyState = document.getElementById("empty-state");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";

  function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    document.getElementById("total-tasks").textContent = totalTasks;
    document.getElementById("completed-tasks").textContent = completedTasks;
    document.getElementById("pending-tasks").textContent = pendingTasks;
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 3000);
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateStats();
  }

  function createTaskElement(taskData) {
    const task = document.createElement("div");
    task.classList.add("task");
    if (taskData.completed) task.classList.add("completed");

    const li = document.createElement("li");
    li.innerText = taskData.text;
    task.appendChild(li);

    const actionDiv = document.createElement("div");
    actionDiv.classList.add("task-actions");

    const checkBtn = document.createElement("button");
    checkBtn.innerHTML = '<i class="fas fa-check"></i>';
    checkBtn.classList.add("checktask");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.classList.add("deletetask");

    actionDiv.appendChild(checkBtn);
    actionDiv.appendChild(deleteBtn);
    task.appendChild(actionDiv);

    checkBtn.addEventListener("click", () => {
      taskData.completed = !taskData.completed;
      task.classList.toggle("completed");
      saveTasks();
      renderTasks();
    });

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== taskData.id);
      saveTasks();
      renderTasks();
    });

    return task;
  }

  function renderTasks() {
    taskContainer.innerHTML = "";

    let filteredTasks = tasks;
    if (currentFilter === "completed") {
      filteredTasks = tasks.filter((task) => task.completed);
    } else if (currentFilter === "pending") {
      filteredTasks = tasks.filter((task) => !task.completed);
    }

    if (filteredTasks.length === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      filteredTasks.forEach((taskData) => {
        taskContainer.appendChild(createTaskElement(taskData));
      });
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.dataset.filter;
      renderTasks();
    });
  });

  addTask.addEventListener("click", function () {
    const taskText = inputTask.value.trim();

    if (taskText === "") {
      showError("Please enter a task");
      return;
    }

    if (taskText.length > 50) {
      showError("Task description must be less than 50 characters");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    inputTask.value = "";
    saveTasks();
    renderTasks();
  });

  inputTask.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask.click();
    }
  });

  // Initial render
  renderTasks();
  updateStats();
});
