const API_URL = "http://localhost:8080/api/tasks";

document.addEventListener("DOMContentLoaded", loadTasks);

function showMessage(message, error = false) {
    const el = document.getElementById("message");
    el.textContent = message;
    el.style.color = error ? "#d32f2f" : "#2e7d32";
    setTimeout(() => el.textContent = "", 2500);
}

async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Backend unavailable");
        const tasks = await response.json();

        const table = document.getElementById("taskTable");
        const empty = document.getElementById("emptyMessage");
        table.innerHTML = "";

        empty.style.display = tasks.length ? "none" : "block";

        tasks.forEach(task => {
            const row = document.createElement("tr");
            const statusClass = task.status === "Completed"
                ? "status-completed" : "status-pending";

            row.innerHTML = `
                <td>${escapeHtml(task.id)}</td>
                <td>${escapeHtml(task.subject)}</td>
                <td>${escapeHtml(task.topic)}</td>
                <td>${escapeHtml(task.studyDate)}</td>
                <td>${escapeHtml(task.studyTime)}</td>
                <td class="${statusClass}">${escapeHtml(task.status)}</td>
                <td>
                    <button class="edit" onclick="editTask(${task.id})">Edit</button>
                    <button class="complete" onclick="completeTask(${task.id})">Complete</button>
                    <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
                </td>
            `;
            table.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        showMessage("Unable to connect to backend. Start Spring Boot first.", true);
    }
}

async function saveTask() {
    const id = document.getElementById("taskId").value;

    const task = {
        subject: document.getElementById("subject").value.trim(),
        topic: document.getElementById("topic").value.trim(),
        studyDate: document.getElementById("studyDate").value,
        studyTime: document.getElementById("studyTime").value,
        status: document.getElementById("status").value
    };

    if (!task.subject || !task.topic || !task.studyDate || !task.studyTime) {
        showMessage("Please fill all fields.", true);
        return;
    }

    try {
        const response = await fetch(id ? `${API_URL}/${id}` : API_URL, {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        });

        if (!response.ok) throw new Error("Save failed");

        showMessage(id ? "Task updated successfully." : "Task added successfully.");
        clearForm();
        loadTasks();
    } catch (error) {
        console.error(error);
        showMessage("Could not save task.", true);
    }
}

async function editTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Task not found");

        const task = await response.json();

        document.getElementById("taskId").value = task.id;
        document.getElementById("subject").value = task.subject;
        document.getElementById("topic").value = task.topic;
        document.getElementById("studyDate").value = task.studyDate;
        document.getElementById("studyTime").value = task.studyTime;
        document.getElementById("status").value = task.status;
        document.getElementById("formTitle").textContent = "Update Study Task";

        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
        showMessage("Could not load task.", true);
    }
}

async function completeTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Task not found");

        const task = await response.json();
        task.status = "Completed";

        const update = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        });

        if (!update.ok) throw new Error("Update failed");

        showMessage("Task marked as completed.");
        loadTasks();
    } catch (error) {
        showMessage("Could not complete task.", true);
    }
}

async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Delete failed");

        showMessage("Task deleted successfully.");
        loadTasks();
    } catch (error) {
        showMessage("Could not delete task.", true);
    }
}

function clearForm() {
    document.getElementById("taskId").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("topic").value = "";
    document.getElementById("studyDate").value = "";
    document.getElementById("studyTime").value = "";
    document.getElementById("status").value = "Pending";
    document.getElementById("formTitle").textContent = "Add Study Task";
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
