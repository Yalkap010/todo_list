document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addTaskModal = document.getElementById('addTaskModal');
    const editTaskModal = document.getElementById('editTaskModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const updateTaskBtn = document.getElementById('updateTaskBtn');
    const taskForm = document.getElementById('taskForm');
    const editTaskForm = document.getElementById('editTaskForm');
    const taskList = document.querySelector('.task-list');
    const remindersList = document.querySelector('.reminders-list');
    const darkModeToggle = document.querySelector('.sidebar-footer .menu-item');
    
    // Sample tasks data
    const sampleTasks = [
        {
            id: 1,
            title: "Exude do",
            description: "Sample task description",
            priority: "low",
            dueDate: new Date(),
            reminder: "none",
            completed: false
        },
        {
            id: 2,
            title: "Have tasks",
            description: "Another sample task",
            priority: "medium",
            dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            reminder: "15min",
            completed: false
        },
        {
            id: 3,
            title: "Test tasks",
            description: "Important task",
            priority: "high",
            dueDate: new Date(),
            reminder: "1hour",
            completed: false
        },
        {
            id: 4,
            title: "Amicate",
            description: "Completed task",
            priority: "low",
            dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
            reminder: "none",
            completed: true
        }
    ];

    // Initialize the app with sample tasks
    function initApp() {
        taskList.innerHTML = '';
        sampleTasks.forEach(task => {
            createTaskElement(task);
        });
    }

    // Create task element
    function createTaskElement(task) {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item slide-in ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;
        
        const priorityClass = `priority-${task.priority}`;
        const priorityText = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
        
        const formattedDate = task.dueDate ? task.dueDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        }) : 'No date';
        
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-details">
                    <div class="task-detail">
                        <i class="far fa-calendar-alt"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="task-detail">
                        <i class="far fa-clock"></i>
                        <span>${task.reminder !== 'none' ? task.reminder : 'No reminder'}</span>
                    </div>
                </div>
            </div>
            <div class="priority ${priorityClass}">${priorityText}</div>
            <div class="task-actions">
                <button class="task-action"><i class="far fa-edit"></i></button>
                <button class="task-action"><i class="far fa-trash-alt"></i></button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
        addTaskEventListeners(taskItem);
        
        // Add reminder if needed
        if (task.reminder !== 'none' && task.dueDate && !task.completed) {
            createReminder(task.title, task.dueDate, task.reminder);
        }
    }

    // Show add task modal
    addTaskBtn.addEventListener('click', function() {
        addTaskModal.classList.add('active');
    });
    
    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            addTaskModal.classList.remove('active');
            editTaskModal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    [addTaskModal, editTaskModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Save new task
    saveTaskBtn.addEventListener('click', function() {
        if (taskForm.checkValidity()) {
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            const priority = document.getElementById('taskPriority').value;
            const dueDate = document.getElementById('taskDueDate').value;
            const reminder = document.querySelector('input[name="reminder"]:checked').value;
            
            const newTask = {
                id: Date.now(),
                title,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                reminder,
                completed: false
            };
            
            createTaskElement(newTask);
            
            // Reset form and close modal
            taskForm.reset();
            addTaskModal.classList.remove('active');
        } else {
            taskForm.reportValidity();
        }
    });
    
    // Edit task functionality
    function setupEditTask(taskItem) {
        const taskId = parseInt(taskItem.dataset.id);
        const task = sampleTasks.find(t => t.id === taskId) || {
            title: taskItem.querySelector('.task-title').textContent,
            description: '',
            priority: taskItem.querySelector('.priority').textContent.toLowerCase(),
            dueDate: null,
            reminder: 'none',
            completed: taskItem.querySelector('.task-checkbox').checked
        };
        
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description;
        document.getElementById('editTaskPriority').value = task.priority;
        document.getElementById('editTaskDueDate').value = task.dueDate ? task.dueDate.toISOString().split('T')[0] : '';
        document.getElementById(`editReminder${task.reminder === 'none' ? 'None' : task.reminder === '15min' ? '15min' : '1hour'}`).checked = true;
        
        editTaskModal.classList.add('active');
        
        // Update task on save
        updateTaskBtn.onclick = function() {
            if (editTaskForm.checkValidity()) {
                const newTitle = document.getElementById('editTaskTitle').value;
                const newDescription = document.getElementById('editTaskDescription').value;
                const newPriority = document.getElementById('editTaskPriority').value;
                const newDueDate = document.getElementById('editTaskDueDate').value;
                const newReminder = document.querySelector('input[name="editReminder"]:checked').value;
                
                // Update task in the array (in a real app, this would update the database)
                const taskIndex = sampleTasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    sampleTasks[taskIndex] = {
                        ...sampleTasks[taskIndex],
                        title: newTitle,
                        description: newDescription,
                        priority: newPriority,
                        dueDate: newDueDate ? new Date(newDueDate) : null,
                        reminder: newReminder
                    };
                }
                
                // Update the task item in the UI
                taskItem.querySelector('.task-title').textContent = newTitle;
                const priorityClass = `priority-${newPriority}`;
                const priorityText = newPriority.charAt(0).toUpperCase() + newPriority.slice(1);
                
                const priorityElement = taskItem.querySelector('.priority');
                priorityElement.className = 'priority ' + priorityClass;
                priorityElement.textContent = priorityText;
                
                const formattedDate = newDueDate ? new Date(newDueDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                }) : 'No date';
                
                taskItem.querySelector('.task-details span:nth-child(1)').textContent = formattedDate;
                taskItem.querySelector('.task-details span:nth-child(2)').textContent = newReminder !== 'none' ? newReminder : 'No reminder';
                
                editTaskModal.classList.remove('active');
            } else {
                editTaskForm.reportValidity();
            }
        };
    }
    
    // Create reminder
    function createReminder(title, dueDate, reminderTime) {
        const reminderItem = document.createElement('div');
        reminderItem.className = 'reminder-item fade-in';
        
        // Calculate reminder time (simplified for demo)
        let reminderText = '';
        if (reminderTime === '15min') reminderText = '15 min before';
        else if (reminderTime === '1hour') reminderText = '1 hour before';
        
        reminderItem.innerHTML = `
            <div class="reminder-time">${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div class="reminder-content">
                <div class="reminder-title">${title}</div>
                <div class="reminder-desc">${reminderText}</div>
            </div>
        `;
        
        remindersList.prepend(reminderItem);
    }
    
    // Add event listeners to tasks
    function addTaskEventListeners(taskItem) {
        const checkbox = taskItem.querySelector('.task-checkbox');
        const editBtn = taskItem.querySelector('.task-action:nth-child(1)');
        const deleteBtn = taskItem.querySelector('.task-action:nth-child(2)');
        
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                taskItem.classList.add('completed');
                // In a real app, update the task status in the database
                const taskId = parseInt(taskItem.dataset.id);
                const taskIndex = sampleTasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    sampleTasks[taskIndex].completed = true;
                }
            } else {
                taskItem.classList.remove('completed');
                // In a real app, update the task status in the database
                const taskId = parseInt(taskItem.dataset.id);
                const taskIndex = sampleTasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    sampleTasks[taskIndex].completed = false;
                }
            }
        });
        
        editBtn.addEventListener('click', function() {
            setupEditTask(taskItem);
        });
        
        deleteBtn.addEventListener('click', function() {
            taskItem.classList.add('fade-out');
            setTimeout(() => {
                // In a real app, delete the task from the database
                const taskId = parseInt(taskItem.dataset.id);
                const taskIndex = sampleTasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    sampleTasks.splice(taskIndex, 1);
                }
                taskItem.remove();
            }, 300);
        });
    }
    
    // Category tabs
    document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('click', function() {
            document.querySelector('.category.active').classList.remove('active');
            this.classList.add('active');
            // In a real app, this would filter tasks
            const category = this.textContent.toLowerCase();
            filterTasks(category);
        });
    });

    // Filter tasks by category
    function filterTasks(category) {
        const tasks = document.querySelectorAll('.task-item');
        tasks.forEach(task => {
            const isCompleted = task.querySelector('.task-checkbox').checked;
            
            switch(category) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'today':
                    const taskDate = task.querySelector('.task-details span:nth-child(1)').textContent;
                    const today = new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                    });
                    task.style.display = taskDate === today ? 'flex' : 'none';
                    break;
                case 'completed':
                    task.style.display = isCompleted ? 'flex' : 'none';
                    break;
                case 'pending':
                    task.style.display = !isCompleted ? 'flex' : 'none';
                    break;
                default:
                    task.style.display = 'flex';
            }
        });
    }
    
    // Menu items
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelector('.sidebar-menu .menu-item.active').classList.remove('active');
            this.classList.add('active');
            // In a real app, this would change views
        });
    });
    
    // Dark mode toggle
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.querySelector('i').classList.remove('fa-moon');
        darkModeToggle.querySelector('i').classList.add('fa-sun');
    }
    
    // Filter/sort button
    document.querySelector('.filter-sort').addEventListener('click', function() {
        alert('Filter/Sort functionality would go here');
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const tasks = document.querySelectorAll('.task-item');
        
        tasks.forEach(task => {
            const title = task.querySelector('.task-title').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    });

    // Initialize the app
    initApp();
});