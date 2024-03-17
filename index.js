// Selecting Some Elements From the DOM 
const taskInput = document.querySelector('#taskInput');
const taskAddingBtn = document.querySelector('#AddTask');
const inCompletedTasksHolder = document.querySelector('#inCompletedTasksHolder');
const completedTasksHolder = document.querySelector('#completedTasksHolder');
const tasksBtns = document.querySelectorAll('.tasksBtns')

// definning Some Necessry Vars
//  we need An array for all the Tasks to holde it
let TasksHolderArray = [];
let tasksArray = []

// And here We need to Make A class for definning All of our Tasks Objects
class Task {
	constructor(title, taskId, date){
		this.title = title;
		this.taskId = taskId;
		this.completed = false;
		this.date = date;
	}
}

checkTasksDate()

renderTasksToDOM()
getTasksFromLocalStorage()
taskAddingBtn.addEventListener('click', addTask)

function addTask(){
	let today = new Date().toDateString()
	let task = new Task(taskInput.value, "task-" + TasksHolderArray.length, today)
	TasksHolderArray.push(task)
	addTasksToLocalStorage(TasksHolderArray)
	renderTasksToDOM()
	taskInput.value = '';
}
function addTasksToLocalStorage(){
	getTasksFromLocalStorage()
	TasksHolderArray.forEach((e, index)=>{
		let jsonElement = JSON.stringify(e);
		// subTasksArray.push(jsonElement)
		localStorage.setItem(e.taskId, jsonElement)
		// console.log(jsonElement)
	})
	console.log(tasksArray)
}
function getTasksFromLocalStorage(){
	tasksArray = []
	for (i = 0; i <= localStorage.length-1; i++) {

		let jsonElement = JSON.parse(localStorage.getItem('task-'+ i))
			tasksArray.push(jsonElement)
	}
}
function loadInitTasksToTheArray(){
	for (i = 0; i <= localStorage.length; i++) {



		let jsonElement = JSON.parse(localStorage.getItem('task'))

		if(jsonElement){
				TasksHolderArray.push(jsonElement)
		}else{
			continue

		}
	}
}
function renderTasksToDOM(){
	getTasksFromLocalStorage()
	// console.log(tasksArray)
	completedTasksHolder.innerHTML = '';
	inCompletedTasksHolder.innerHTML = '';
	tasksArray.forEach((e, i)=>{
		if(e){
			createElements(e , e.completed)
		}
		else{

		}

	})
}
function createElements (el, completed){
			let task = document.createElement('div');
			task.classList.add('task');
			task.classList.add(el.taskId)
			

			// this is the details of tasl div
			let detailsDiv = document.createElement('div');
			detailsDiv.classList.add('taskDetails');
			task.append(detailsDiv)

			// task Details Elements input and label
			let checkBox = document.createElement('input');
			checkBox.type = 'checkbox';
			checkBox.id = el.taskId
			checkBox.name = el.taskId + 'check'
			detailsDiv.append(checkBox)
			checkBox.addEventListener('click', makeATaskCompleted)
			// the label
			let label = document.createElement('label');
			label.htmlFor = el.taskId;
			label.textContent = el.title? el.title: "Undefined" 
			

			let delElement = document.createElement('del')

			// div for btns in task elements 
			let btnsDiv = document.createElement('div');
			btnsDiv.classList.add('tasksBtns-container');
			task.append(btnsDiv);

			// btns of a task 
			let editBtn = document.createElement('input');
			editBtn.type = 'button';
			editBtn.value = 'Edit Task';
			editBtn.classList.add('tasksBtns')
			editBtn.name = el.taskId	+ 'editBtn'
			btnsDiv.append(editBtn)
			editBtn	.addEventListener ('click', popUpForTaskEditing)
			let delBtn = document.createElement('input');
			delBtn.type = 'button';
			delBtn.value = 'Del';
			delBtn.name = el.taskId	+ 'Btn'
			delBtn.classList.add('tasksBtns');
			btnsDiv.append(delBtn)
			delBtn.addEventListener ('click', delTask)
			// this condition is set to check the completed tasks
			if(el.completed){
				inCompletedTasksHolder.append(task)
				detailsDiv.append(delElement);
				delElement.append(label)
				// delBtn.disabled = true
				editBtn.disabled = true
				checkBox.disabled = true
				label.disabled = true
				checkBox.checked = true
			}else{
				completedTasksHolder.append(task)
				detailsDiv.append(label)
			}
			console	.log()

}
function popUpForTaskEditing(event){
	let perantEvent = event
	let popUp = document.createElement('div');
	popUp.classList.add('popUp')

	let popUpInput = document.createElement('input');
	popUpInput.type = 'text';
	popUpInput.classList.add('popUpInput');
	popUp.append(popUpInput);

	let popUpsubDiv = document.createElement('div');
	popUpsubDiv.classList.add('popUpsubDiv')
	popUp.append(popUpsubDiv)



	let popUpButtonOk = document.createElement('input');
	popUpButtonOk.type = 'button';
	popUpButtonOk.value = 'Ok'
	popUpButtonOk.classList.add('AddTaskBTN');
	popUpButtonOk.classList.add('popUpButton');
	popUpButtonOk.id = 'popUpButtonOk'
	popUpButtonOk.addEventListener('click', editTask)
	popUpsubDiv.append(popUpButtonOk);

	let popUpButtonC = document.createElement('input');
	popUpButtonC.type = 'button';
	popUpButtonC.value = 'Cancel'
	popUpButtonC.classList.add('AddTaskBTN');
	popUpButtonC.classList.add('popUpButton');
	popUpButtonC.id = 'popUpButtonC'
	popUpButtonC.addEventListener('click', hidepopUp)
	popUpsubDiv.append(popUpButtonC);
	console.log(popUpButtonC)

	document.body.append(popUp)


	function hidepopUp(){
		popUp.style.display = 'none';

		popUpButtonC.removeEventListener('click', hidepopUp)
	}
	function editTask(event){



		let storageKey = perantEvent.target.name.replace('editBtn', '')
		let localStorageItem = JSON.parse(localStorage.getItem(storageKey))
		localStorageItem.title = popUpInput.value
		localStorage.setItem(storageKey, JSON.stringify(localStorageItem))
		TasksHolderArray = []
		loadInitTasksToTheArray()
		console.log(TasksHolderArray)
		getTasksFromLocalStorage()
		renderTasksToDOM()
		console.log(storageKey)
		popUp.style.display = 'none';
		

		popUpButtonOk.removeEventListener('click', editTask)


	}
}

function delTask(event){
	let elementKey = event.target.name.replace('Btn', '')
	TasksHolderArray = tasksArray.filter((e)=>{
		return e.taskId !== elementKey
	})
	TasksHolderArray.forEach((e, i)=>{
		e.taskId = 'task-' + i
	})
	localStorage.clear()
	addTasksToLocalStorage()
	renderTasksToDOM()
	console.log(TasksHolderArray)

}
function makeATaskCompleted (event){
	let storageKey = event.target.name.replace('check', '')
	let localStorageItem = JSON.parse(localStorage.getItem(storageKey))
	localStorageItem.completed = true
	localStorage.setItem(storageKey, JSON.stringify(localStorageItem))
	TasksHolderArray = []
	loadInitTasksToTheArray()
	console.log(TasksHolderArray)
	getTasksFromLocalStorage()
	renderTasksToDOM()
}

function checkTasksDate(){
	let today = new Date().toDateString()
	let tasksDate = JSON.parse(localStorage.getItem('task-0')) ? JSON.parse(localStorage.getItem('task-0')).date: '';
	if(today > tasksDate){
		localStorage.clear()
	}else{
		console.log(today , ',' ,tasksDate)
	}
}



