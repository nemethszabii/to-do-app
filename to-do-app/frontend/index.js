// -- VARIABLES
const tbody = document.querySelector("#tbody");
const apiBase = "https://localhost:7182/api/ToDo/";

const createBtn = document.getElementById("createBtn");
const createCancelBtn = document.getElementById("cancelBtn");
const updateCancelBtn = document.getElementById("updateCancelBtn");

const completionFilter = document.getElementById("completionFilter");

const createForm = document.getElementById("createForm");
const updateForm = document.getElementById("updateForm");

let isFiltered = false;
const filterLabel = document.getElementById("filterLabel");

// -- EVENT LISTENERS
createForm.addEventListener("submit", createNew);
updateBtn.addEventListener("click", updateObj);
document.addEventListener('DOMContentLoaded', getAll);
createBtn.addEventListener("click", (e) => {
    e.target.style.display = "none";
    createForm.style.display = "block";

    if (updateForm.style.display == "block") {
        updateForm.style.display = "none";
    }
});
createCancelBtn.addEventListener("click", () => {
    if (createForm.style.display == "block") {
        createForm.style.display = "none";
        createBtn.style.display = "block";
        createForm.reset();
    }
});
updateCancelBtn.addEventListener("click", () => {
    if (updateForm.style.display == "block") {
        updateForm.style.display = "none";
        updateForm.reset();
    }

    if (createBtn.style.display == "none") {
        createBtn.style.display = "block";
    }
});
completionFilter.addEventListener("change", filter);

// -- FUNCTIONS
async function updateHelper(e) {

    if (createForm.style.display == "block") {
        createForm.style.display = "none";
    }

    document.getElementById("updateBtn").dataset.id = e.target.dataset.id;
    if (updateForm.style.display == "none" || updateForm.style.display == "") {
        updateForm.style.display = "block";
    }
    const obj = await getObj(e.target.dataset.id);
    document.getElementById("updateTitle").value = obj.title;
    obj.isCompleted ? document.getElementById("updateIsCompleted").checked = true : document.getElementById("updateIsCompleted").checked = false;
    let formattedDate = obj.dueDate.toString().substring(0, obj.dueDate.indexOf("T"));
    document.getElementById("updateDueDate").value = formattedDate;
}   

async function updateObj(e) {
    const updateTitle = document.getElementById("updateTitle").value;
    const updateIsCompleted = document.getElementById("updateIsCompleted").checked;
    const updateDueDate = document.getElementById("updateDueDate").value;
    const updatedObj = {
        id: e.target.dataset.id,
        title: updateTitle,
        isCompleted: updateIsCompleted,
        dueDate: updateDueDate
    };

    const answer = confirm(`Are you sure you want to update the object with this id: ${e.target.dataset.id}?`)
    if (!answer) {
        return;
    }
    
    const response = await fetch(apiBase + `${updatedObj.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedObj)
    });

    if (!response.ok) {
        throw new Error(`Obj could not be updated: ID[${updatedObj.id}] - ${updatedObj.title}`)
    }

    updateForm.reset();
    await getAll();
}

async function getObj(id) {
    const response = await fetch(apiBase + `${id}`, {
        method: "GET"
    });
    if (!response.ok) {
        throw new Error(`Could not get file with id: ${id}`);
    }
    return await response.json();
}

async function deleteObj(e) {
    const answer = confirm(`Are you sure you want to delete the object with this id: ${e.target.dataset.id}?`)
    if (!answer) {
        return;
    }
    
    const response = await fetch(apiBase + `${e.target.dataset.id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(`Could not delete object: ${response.status}`);
    }

    await getAll();
}

async function createNew(e) {
    e.preventDefault();
    const titleValue = document.getElementById("title").value;
    const isCompletedValue = document.getElementById("isCompleted").checked;
    const dueDate = document.getElementById("dueDate").value;
    const obj = {
        title: titleValue,
        isCompleted: isCompletedValue,
        dueDate: dueDate
    };

    const answer = confirm(`Are you sure you want to create this object: [${obj.title} - ${obj.isCompleted}]?`)
    if (answer) {
        const response = await fetch(apiBase, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });

        if (!response.ok) {
            alert("Due Date can not be in the past!");
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        createForm.reset();
        await getAll();
    }
}

async function getAll() {
    tbody.innerHTML = "";
    const response = await fetch(apiBase);

    if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const todos = await response.json();
    
    todos.forEach((element) => {
        const deleteBtn = document.createElement("button");
        const editBtn = document.createElement("button");

        deleteBtn.dataset.id = element.id;      
        editBtn.dataset.id = element.id;

        const tr = document.createElement("tr");
       
        const idTd = document.createElement("td");
        idTd.innerText = element.id;

        const titleTd = document.createElement("td");
        titleTd.innerText = element.title; 

        const isCompletedTd = document.createElement("td");
        isCompletedTd.id = "isCompletedTd";
        isCompletedTd.innerText = element.isCompleted ? "TRUE": "FALSE";

        const dueDateTd = document.createElement("td");
        dueDateTd.innerText = element.dueDate.toString().substring(0, element.dueDate.indexOf("T")); 

        tr.append(idTd, titleTd, isCompletedTd, dueDateTd);

        // ------- WITH REFLECTION -------

        // for (let key in element) {
        //     if (element.hasOwnProperty(key)) {
        //         const td = document.createElement("td");
        //         if (key == "isCompleted") {
        //             let propAsString = element[key].toString().toUpperCase();
        //             td.innerText = propAsString;
        //         } else {
        //             td.innerText = element[key];
        //         }
        //         tr.appendChild(td);
        //     }
        // }

        const actionsTd = document.createElement("td");
        
        editBtn.classList.add("edit-btn");
        editBtn.innerText = "✏️";
        editBtn.addEventListener("click", updateHelper);

        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerText = "🗑️";
        deleteBtn.addEventListener("click", deleteObj);
        
        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(deleteBtn);
        tr.appendChild(actionsTd);

        tbody.appendChild(tr);
    });
}

function filter(todos) {
    if (!isFiltered) {
        for (let tr of tbody.querySelectorAll("tr")) {
            for (let td of tr.children) {
                if (td.id == "isCompletedTd" && td.innerText == "FALSE") {
                    tr.style.display = "none";
                    isFiltered = true;
                    filterLabel.innerText = "Show All";
                }
            }
        }   
    } else {
        for (let tr of tbody.querySelectorAll("tr")) {
            for (let td of tr.children) {
                if (td.id == "isCompletedTd" && td.innerText == "FALSE") {
                    tr.style.display = "table-row";
                    isFiltered = false;
                    filterLabel.innerText = "Show Only Completed";
                }
            }
        } 
    }
}