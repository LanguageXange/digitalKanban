// Start of Dark/Light Theme Toggle
const toggleSwitch = document.querySelector('input[type="checkbox"]');
const nav = document.getElementById("nav");
const toggleIcon = document.getElementById("toggle-icon");
const image1 = document.getElementById("image1");
const image2 = document.getElementById("image2");
const image3 = document.getElementById("image3");
const textBox = document.getElementById("text-box");
function imageMode(color) {
  image1.src = `img/add_${color}.svg`;
  image2.src = `img/update_${color}.svg`;
  image3.src = `img/track_${color}.svg`;
}
function toggleDarkLightMode(isDark) {
  nav.style.backgroundColor = isDark
    ? "rgb(0 0 0 / 80%)"
    : "rgb(255 255 255 / 70%)";
  imageMode(isDark ? "dark" : "light");
  isDark
    ? toggleIcon.children[0].classList.replace("fa-sun", "fa-moon")
    : toggleIcon.children[0].classList.replace("fa-moon", "fa-sun");
  isDark
    ? toggleIcon.children[0].classList.replace("sun", "moon")
    : toggleIcon.children[0].classList.replace("moon", "sun");
}
function switchTheme(event) {
  if (event.target.checked) {
    document.documentElement.setAttribute("color-theme", "dark");
    localStorage.setItem("theme", "dark");
    toggleDarkLightMode(true);
  } else {
    document.documentElement.setAttribute("color-theme", "light");
    localStorage.setItem("theme", "light");
    toggleDarkLightMode(false);
  }
}
const currentTheme = localStorage.getItem("theme");
if (currentTheme) {
  document.documentElement.setAttribute("color-theme", currentTheme);
  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
    toggleDarkLightMode(true);
  }
}
toggleSwitch.addEventListener("change", switchTheme);
// End of Dark/Light Theme Toggle

// Start of Typing Effect
let myinput = [
  "Visualize Workflow.",
  "Maximize Efficiency.",
  "Light & Dark Mode.",
  "Get things done!",
];
let characterCount = 0;
let item = 0;
let speed = 115;
function typing() {
  if (characterCount < myinput[item].length) {
    document.getElementById("input").innerHTML += myinput[item].charAt(
      characterCount
    );
    characterCount++;
    setTimeout(typing, speed);
  } else setTimeout(erase, speed - 80);
}
function erase() {
  if (characterCount >= 0) {
    // extract substring
    document.getElementById("input").innerHTML = myinput[item].substring(
      0,
      characterCount
    );
    characterCount--;
    setTimeout(erase, speed - 80);
  } else {
    // move to the next item in the array
    item++;
    if (item >= myinput.length) item = 0;
    setTimeout(typing, speed);
  }
}
window.onload = typing;
// End of Typing Effect
//Start of CTA button
function subscribe() {
  alert("Woohoo! You have successfully subscribed to our newsletter!");
}
const closeBtn = document.getElementById("close");
const newsContainer = document.getElementById("news");
closeBtn.addEventListener("click", () => {
  hidePopup();
  var expireAt = new Date();
  expireAt = expireAt.setSeconds(expireAt.getSeconds());
  localStorage.setItem("expiration", expireAt);
});

function showPopup() {
  newsContainer.classList.add("show");
}

function hidePopup() {
  newsContainer.classList.remove("show");
}

function scrollFunction() {
  if (
    document.body.scrollTop > 900 ||
    document.documentElement.scrollTop > 900
  ) {
    showPopup();
  }
}

window.onscroll = function () {
  const currentTime = new Date().getTime();
  // the moment you scroll it gets the currenttime and compare it with localStorage time
  const expireTime = localStorage.getItem("expiration");
  // expireTime is null when you first start
  if (expireTime !== null && currentTime - Number(expireTime) < 900000) {
    hidePopup();
  } else {
    scrollFunction();
  }
};
//End of CTA button

//Start of Kanban board
const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogListEl = document.getElementById("backlog-list");
const progressListEl = document.getElementById("progress-list");
const completeListEl = document.getElementById("complete-list");
const onHoldListEl = document.getElementById("on-hold-list");
// variables
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
let draggedItem;
let currentColumn;
// once we update the DOM, updateOnload will be true
let updatedOnLoad = false;
let dragging = false;

// set default values when we first load the page
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
    completeListArray = JSON.parse(localStorage.completeItems);
  } else {
    backlogListArray = ["I'm a backlog update me!", "Edit me"];
    progressListArray = ["Enter some stuff here!", "something in progress"];
    onHoldListArray = ["things need to be reviewed!"];
    completeListArray = ["Being Awesome!", "Woohoo done!"];
  }
}

function setStorageArray() {
  listArrays = [
    backlogListArray,
    progressListArray,
    onHoldListArray,
    completeListArray,
  ];
  const arrayNames = ["backlog", "progress", "onHold", "complete"];

  arrayNames.forEach((name, i) => {
    localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[i]));
  });
}

function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null || item !== "");
  return filteredArray;
}
// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement("li");
  listEl.textContent = item;
  listEl.id = index; // to target each task in the list
  listEl.classList.add("drag-item");
  listEl.draggable = true;
  listEl.contentEditable = true; // so that we can edit update each task
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  listEl.setAttribute("ondragstart", "drag(event)");

  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once and get default array
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogListEl.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogListEl, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressListEl.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressListEl, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // On Hold Column
  onHoldListEl.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldListEl, 2, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Complete Column
  completeListEl.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeListEl, 3, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  updatedOnLoad = true;
  setStorageArray();
}

// selectedColumn is the li element tags
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;
  // enable updating items only when we are not dragging!
  if (!dragging) {
    if (!selectedColumn[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumn[id].textContent;
    }
    updateDOM();
  }
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM(column);
}

function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

// Allows arrays to reflect Drag and Drop items
// reinitialzie the array to empty otherwise array items will keep adding up
// htmlCollection is not really an array need to do array.from()
function rebuildArrays() {
  backlogListArray = Array.from(backlogListEl.children).map(
    (i) => i.textContent
  );
  progressListArray = Array.from(progressListEl.children).map(
    (i) => i.textContent
  );

  completeListArray = Array.from(completeListEl.children).map(
    (i) => i.textContent
  );

  onHoldListArray = Array.from(onHoldListEl.children).map((i) => i.textContent);

  updateDOM();
}

// When Item Enters Column Area
// column variable is simply the index of the column we passs in html
function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}
function allowDrop(e) {
  e.preventDefault();
}
// When Item Starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}
// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // Add item to Column
  parent.appendChild(draggedItem);
  // resetting dragging to false once drop the item
  dragging = false;
  rebuildArrays();
}
updateDOM();
