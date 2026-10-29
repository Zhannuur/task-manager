// ===== БЕТТЕР АРАСЫНДА АУЫСУ =====

const pages = document.querySelectorAll(".page");
const pageLinks = document.querySelectorAll("[data-page]");

function showPage(pageName) {
    const targetPage = document.getElementById(pageName);

    if (!targetPage) return;

    pages.forEach(function (page) {
        page.classList.remove("active");
    });

    targetPage.classList.add("active");

    document.querySelectorAll("nav [data-page]").forEach(function (link) {
        link.classList.toggle(
            "active",
            link.dataset.page === pageName
        );
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

pageLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        showPage(link.dataset.page);
    });
});


// ===== ТІРКЕЛУ ФОРМАСЫ =====

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (name.length < 2) {
            alert("Атыңды дұрыс енгіз!");
            return;
        }

        if (password.length < 6) {
            alert("Құпиясөз кемінде 6 таңбадан тұруы керек!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Құпиясөздер бірдей емес!");
            return;
        }

        alert(
            "Форма дұрыс толтырылды! " +
            "Нақты тіркелу жүйесі PHP арқылы кейін қосылады."
        );
    });
}


// ===== КІРУ ФОРМАСЫ =====

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password =
            document.getElementById("loginPassword").value;

        if (!email || !password) {
            alert("Барлық өрісті толтыр!");
            return;
        }

        alert(
            "Форма тексерілді. Нақты аккаунтқа кіру " +
            "PHP және MySQL қосылғаннан кейін іске асады."
        );
    });
}


// ===== ТАПСЫРМАЛАРДЫ САҚТАУ =====

const taskForm = document.getElementById("taskForm");

if (taskForm) {
    const taskTitle = document.getElementById("taskTitle");
    const taskCategory = document.getElementById("taskCategory");
    const taskList = document.getElementById("taskList");
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");

    let tasks = [];

    // Сақталған тапсырмаларды жүктеу
    try {
        const savedTasks = JSON.parse(
            localStorage.getItem("taskManagerTasks") || "[]"
        );

        if (Array.isArray(savedTasks)) {
            tasks = savedTasks.filter(function (task) {
                return (
                    task &&
                    typeof task.id === "number" &&
                    typeof task.title === "string" &&
                    typeof task.category === "string" &&
                    typeof task.completed === "boolean"
                );
            });
        }
    } catch (error) {
        tasks = [];
    }

    // Тапсырмаларды сақтау
    function saveTasks() {
        try {
            localStorage.setItem(
                "taskManagerTasks",
                JSON.stringify(tasks)
            );
        } catch (error) {
            alert("Деректерді сақтау мүмкін болмады!");
        }
    }

    // Тапсырмалар санын жаңарту
    function updateStats() {
        document.getElementById("totalCount").textContent =
            tasks.length;

        document.getElementById("pendingCount").textContent =
            tasks.filter(function (task) {
                return !task.completed;
            }).length;

        document.getElementById("completedCount").textContent =
            tasks.filter(function (task) {
                return task.completed;
            }).length;
    }

    // Тапсырмаларды экранға шығару
    function renderTasks() {
        taskList.replaceChildren();

        const search = searchInput.value.trim().toLowerCase();
        const filter = statusFilter.value;

        const filteredTasks = tasks.filter(function (task) {
            const matchesSearch =
                task.title.toLowerCase().includes(search) ||
                task.category.toLowerCase().includes(search);

            const matchesFilter =
                filter === "all" ||
                (filter === "completed" && task.completed) ||
                (filter === "pending" && !task.completed);

            return matchesSearch && matchesFilter;
        });

        if (filteredTasks.length === 0) {
            const message = document.createElement("p");

            message.className = "empty-message";
            message.textContent = tasks.length === 0
                ? "Әзірге тапсырмалар жоқ. Бірінші тапсырмаңды қос!"
                : "Сәйкес тапсырмалар табылмады.";

            taskList.appendChild(message);
        }

        filteredTasks.forEach(function (task) {
            const item = document.createElement("article");
            item.className = "task-item";

            if (task.completed) {
                item.classList.add("completed");
            }

            const info = document.createElement("div");
            info.className = "task-info";

            const title = document.createElement("h3");
            title.textContent = task.title;

            const category = document.createElement("p");
            category.textContent = "Санат: " + task.category;

            const status = document.createElement("p");
            status.textContent = task.completed
                ? "✓ Орындалды"
                : "○ Орындалмаған";

            info.append(title, category, status);

            const actions = document.createElement("div");
            actions.className = "task-actions";

            const completeButton = document.createElement("button");
            completeButton.className = "small-btn complete-btn";
            completeButton.textContent = task.completed
                ? "Қайтару"
                : "Орындалды";

            completeButton.addEventListener("click", function () {
                task.completed = !task.completed;

                saveTasks();
                renderTasks();
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "small-btn delete-btn";
            deleteButton.textContent = "Өшіру";

            deleteButton.addEventListener("click", function () {
                const confirmed = confirm(
                    "Осы тапсырманы өшіргің келе ме?"
                );

                if (!confirmed) return;

                tasks = tasks.filter(function (currentTask) {
                    return currentTask.id !== task.id;
                });

                saveTasks();
                renderTasks();
            });

            actions.append(completeButton, deleteButton);
            item.append(info, actions);
            taskList.appendChild(item);
        });

        updateStats();
    }

    // Жаңа тапсырма қосу
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = taskTitle.value.trim();

        if (!title) {
            alert("Тапсырма атауын енгіз!");
            return;
        }

        if (title.length > 200) {
            alert("Тапсырма атауы 200 таңбадан аспауы керек!");
            return;
        }

        const newTask = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            title: title,
            category: taskCategory.value,
            completed: false
        };

        tasks.push(newTask);

        saveTasks();
        taskForm.reset();
        renderTasks();
    });

    // Іздеу
    searchInput.addEventListener("input", renderTasks);

    // Күйі бойынша сүзу
    statusFilter.addEventListener("change", renderTasks);

    // Бетті алғаш ашқанда тапсырмаларды көрсету
    renderTasks();
}