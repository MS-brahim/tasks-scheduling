function assignTasksWithPriorityAndDependencies(developers, tasks) {
    // Step 1: Sort tasks by priority (higher priority first)
    tasks.sort((a, b) => b.priority - a.priority);

    // Create a set to track completed tasks for checking dependencies
    const completedTasks = new Set();

    // Initialize developers with properties for assigned tasks and total work hours
    developers.forEach(developer => {
        developer.assignedTasks = [];
        developer.totalWorkHours = 0;
    });

    // List to track unassigned tasks
    const unassignedTasks = [];

    // Step 2: Try to assign tasks to developers
    for (const task of tasks) {
        // Check if all dependencies are satisfied
        if (!task.dependencies.every(dep => completedTasks.has(dep))) {
            // If dependencies are not met, add to unassigned tasks and continue
            unassignedTasks.push(task);
            continue;
        }

        // Try to find a suitable developer for the task
        let taskAssigned = false;
        for (const developer of developers) {
            // Check if the developer can take this task based on skill, hours, and preference
            const canAssignTask =
                developer.skillLevel >= task.difficulty &&
                developer.totalWorkHours + task.hoursRequired <= developer.maxHours &&
                (!task.taskType || developer.preferredTaskType === task.taskType);

            if (canAssignTask) {
                // Assign the task to this developer
                developer.assignedTasks.push(task);
                developer.totalWorkHours += task.hoursRequired;
                completedTasks.add(task.taskName);
                taskAssigned = true;
                break;
            }
        }

        // If no developer could be assigned the task, add it to unassigned tasks
        if (!taskAssigned) {
            unassignedTasks.push(task);
        }
    }

    // Step 3: Format the result to show developers with their assigned tasks
    const result = developers.map(dev => ({
        name: dev.name,
        totalWorkHours: dev.totalWorkHours,
        assignedTasks: dev.assignedTasks.map(task => ({
            taskName: task.taskName,
            difficulty: task.difficulty,
            hoursRequired: task.hoursRequired,
            taskType: task.taskType,
            priority: task.priority,
            dependencies: task.dependencies
        }))
    }));

    console.log("Developers and their assigned tasks:");
    result.forEach(dev => {
        console.log(`\nDeveloper: ${dev.name}`);
        console.log(`Total Work Hours: ${dev.totalWorkHours}`);
        console.log("Assigned Tasks:");
        if (dev.assignedTasks.length > 0) {
            dev.assignedTasks.forEach(task => {
                console.log(`  - Task Name: ${task.taskName}`);
                console.log(`    Difficulty: ${task.difficulty}`);
                console.log(`    Hours Required: ${task.hoursRequired}`);
                console.log(`    Task Type: ${task.taskType}`);
                console.log(`    Priority: ${task.priority}`);
                console.log(`    Dependencies: ${task.dependencies.join(', ') || 'None'}`);
            });
        } else {
            console.log("  No tasks assigned.");
        }
    });

    console.log("\nUnassigned Tasks:");
    if (unassignedTasks.length > 0) {
        unassignedTasks.forEach(task => {
            console.log(`  - Task Name: ${task.taskName}`);
            console.log(`    Difficulty: ${task.difficulty}`);
            console.log(`    Hours Required: ${task.hoursRequired}`);
            console.log(`    Task Type: ${task.taskType}`);
            console.log(`    Priority: ${task.priority}`);
            console.log(`    Dependencies: ${task.dependencies.join(', ') || 'None'}`);
        });
    } else {
        console.log("  All tasks have been assigned.");
    }
}



// Example data
const developers = [
    { name: 'Alice', skillLevel: 7, maxHours: 40, preferredTaskType: 'feature' },
    { name: 'Bob', skillLevel: 9, maxHours: 30, preferredTaskType: 'bug' },
    { name: 'Charlie', skillLevel: 5, maxHours: 35, preferredTaskType: 'refactor' },
];


const tasks = [
    {
        taskName: 'Feature A', difficulty: 7, hoursRequired: 15, taskType: 'feature', priority: 4,
        dependencies: []
    },
    {
        taskName: 'Bug Fix B', difficulty: 5, hoursRequired: 10, taskType: 'bug', priority: 5,
        dependencies: []
    },
    {
        taskName: 'Refactor C', difficulty: 9, hoursRequired: 25, taskType: 'refactor', priority: 3,
        dependencies: ['Bug Fix B']
    },
    {
        taskName: 'Optimization D', difficulty: 6, hoursRequired: 20, taskType: 'feature', priority: 2,
        dependencies: []
    },
    {
        taskName: 'Upgrade E', difficulty: 8, hoursRequired: 15, taskType: 'feature', priority: 5,
        dependencies: ['Feature A']
    },
];


// Testing the function
assignTasksWithPriorityAndDependencies(developers, tasks);
