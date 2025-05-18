// Truy cập nhanh phần tử bằng cú pháp $
const $ = document.querySelector.bind(document);

// Các phần tử cần thiết từ DOM
const todoList = $('#todo-list');     // danh sách chưa làm
const doneList = $('#done-list');     // danh sách đã làm
const addBtn = $('#add-btn');         // nút "Add"
const newTaskInput = $('#new-task');  // ô nhập task mới

// Lấy tasks từ localStorage (nếu có), nếu không thì dùng danh sách mặc định
let tasks = JSON.parse(localStorage.getItem('todo-tasks')) || [
    { id: 1, text: "Learning JavaScript", done: false }
];

let dragTagId = null; // ID task đang được kéo

// Thêm task mới
function addTask(text) {
    // Tạo ID mới tự động
    const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const newTask = { id: newId, text, done: false };
    tasks.push(newTask);

    // Lưu vào localStorage
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
}

// Xóa task
function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    // Lưu vào localStorage
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));

    renderTasks(); // Vẽ lại danh sách
}

// Xử lý khi bấm nút "Add"
addBtn.addEventListener('click', () => {
    const text = newTaskInput.value.trim();
    if (text !== "") {
        addTask(text);
        newTaskInput.value = "";
        renderTasks();
    }
});

// Vẽ lại danh sách tasks
function renderTasks() {
    // Xóa giao diện cũ
    todoList.innerHTML = "";
    doneList.innerHTML = "";

    // Duyệt qua từng task
    tasks.forEach(task => {
        // Tạo khung task
        const taskDiv = document.createElement("div");
        taskDiv.className = "list";
        taskDiv.draggable = true;         // cho phép kéo
        taskDiv.dataset.id = task.id;     // lưu ID

        // Tạo nội dung cho task
        taskDiv.innerHTML = `
            <i class="fa-solid fa-list"></i>
            <p class="${task.done ? 'done-text' : ''}">${task.text}</p>
            <div class="i-e">
                <i class="check-btn ${task.done ? 'fa-solid fa-rotate-left' : 'fa-regular fa-circle-check'}"></i>
                <i class="delete-btn fa-regular fa-circle-xmark"></i>
            </div>
        `;

        // Kéo task
        taskDiv.addEventListener("dragstart", () => {
            dragTagId = task.id;
        });

        // Đánh dấu hoàn thành
        const checkBtn = taskDiv.querySelector('.check-btn');
        checkBtn.addEventListener("click", () => {
            task.done = !task.done;

            // Lưu thay đổi
            localStorage.setItem('todo-tasks', JSON.stringify(tasks));
            renderTasks();
        });

        // Xóa task
        const deleteBtn = taskDiv.querySelector('.delete-btn');
        deleteBtn.addEventListener("click", e => {
            e.stopPropagation(); // tránh click lan sang các phần khác
            removeTask(task.id);
        });

        // Gắn vào danh sách phù hợp
        if (task.done) {
            doneList.appendChild(taskDiv);
        } else {
            todoList.appendChild(taskDiv);
        }
    });
}

// Gắn sự kiện Drag & Drop cho 2 danh sách (todo + done)
[todoList, doneList].forEach(list => {
    list.addEventListener("dragover", e => {
        e.preventDefault(); // Cho phép drop
    });

    list.addEventListener("drop", () => {
        if (dragTagId !== null) {
            // Cập nhật trạng thái task khi thả vào list
            tasks = tasks.map(task => {
                if (task.id === dragTagId) {
                    return { ...task, done: list === doneList };
                }
                return task;
            });
            dragTagId = null;

            // Lưu thay đổi
            localStorage.setItem('todo-tasks', JSON.stringify(tasks));

            renderTasks();
        }
    });
});

// Hiển thị ban đầu khi load trang
renderTasks();
