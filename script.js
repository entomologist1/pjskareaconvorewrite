AOS.init();

window.scrollTo({ top: 0, behavior: "smooth" });


var speakerSelect = false;
var areaConvoSelect = false;
var dialogueSelect = false;

var speakerList = [];
var areaConvoList = [];

//global #sorry

//areaconvo contains  a dialoguelist
//dialoguelist contains speakers and text
//use true id to get info for outputting name/color/images

class Speaker {
  constructor(initName, initColor, initImagePath) {
    this.name = initName;
    this.color = initColor;

    this.images = {
      default: initImagePath //forever
    };

    this.trueID = `${Date.now()}-${Math.floor(Math.random() * 100000)}`; //welcome back relationshipchartmaker
  }

  changeName(newName) {
    this.name = newName;
  }

  changeColor(newColor) {
    this.color = newColor;
  }

  //nvm no overwriting too confusing
  //idk control f in the exported html if its so urgent
  addOverwriteImage(imagePath, imageName) {
    this.images[imageName] = imagePath;
  }

  removeImage(imageName) {
    if (imageName === "default") {
      return;
    }

    delete this.images[imageName];
  }
}

//sortable js will be here eventually
class DialogueBox {
  constructor(selectedSpeaker) {
    this.speakerID = selectedSpeaker.trueID;
    this.dialogueText = "Replace text here .........";
    this.imageName = "default";

    this.trueID = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }

  replaceSpeaker(newSpeaker) {
    this.speakerID = newSpeaker.trueID;

    if (this.imageName in newSpeaker.images) {
      //no need to change anything
      return;
    } else {
      this.imageName = "default";
    }
  }

  changeImageName(newImageName) {
    const currentSpeaker = speakerList.find(
      (speaker) => speaker.trueID === this.speakerID
    );

    if (!currentSpeaker) {
      console.error("Speaker not found... somehow...");
      this.imageName = "default";
      return;
    }

    if (!(newImageName in currentSpeaker.images)) {
      alert(
        "Image name not found under current speaker, defaulting to default"
      );

      this.imageName = "default";
      return;
    }

    this.imageName = newImageName;
  }

  changeDialogue(newDialogue) {
    this.dialogueText = newDialogue;
  }

  reorderDialogueBox() {}
}

//here too
class AreaConvoBox {
  constructor(initName, imagePath) {
    this.name = initName;
    this.imagePath = imagePath;
    this.dialogueBoxList = [];

    this.trueID = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }

  changeName(newName) {
    this.name = newName;
  }

  changeImagePath(newImagePath) {
    this.imagePath = newImagePath;
  }

  addDialogueBox(speaker) {
    this.dialogueBoxList.push(new DialogueBox(speaker));
  }

  removeDialogueBox(dialogueBoxID) {
    const index = this.dialogueBoxList.findIndex(
      (dialogueBox) => dialogueBox.trueID === dialogueBoxID
    );

    if (index === -1) {
      console.error("DialogueBox not found .......");
      return;
    }

    this.dialogueBoxList.splice(index, 1);
  }
}

//////////////////////////////

////////////////////////////////////////////////////////////

//speaker helpers

function getSelectedSpeaker() {
  //helper for getting true id
  const selectedSpeakerElement = document.querySelector(
    "#speakerEditingHere #speakerList .selected"
  );

  if (!selectedSpeakerElement) {
    return null;
  }

  const selectedSpeakerID = selectedSpeakerElement.dataset.trueId;

  const selectedSpeaker = speakerList.find(
    (speaker) => speaker.trueID === selectedSpeakerID
  );

  return selectedSpeaker || null;
}

function getSpeakerByID(speakerID) {
  return speakerList.find((speaker) => speaker.trueID === speakerID) || null;
}

//rendering helpers
function renderSpeaker(speaker) {
  const speakerListElement = document.querySelector(
    "#speakerEditingHere #speakerList"
  );

  if (!speakerListElement || !speaker) {
    return;
  }

  const speakerDiv = document.createElement("div");

  speakerDiv.classList.add("speaker-entry");
  speakerDiv.dataset.trueId = speaker.trueID;
  speakerDiv.style.position = "relative";
  speakerDiv.style.margin = "10px";
  speakerDiv.style.padding = "10px";
  speakerDiv.style.border = "1px solid black";
  speakerDiv.style.borderRadius = "5px";
  speakerDiv.style.backgroundColor = speaker.color;

  speakerDiv.style.display = "inline-flex";
  speakerDiv.style.flexDirection = "column";
  speakerDiv.style.justifyContent = "center";
  speakerDiv.style.alignItems = "center";
  speakerDiv.style.textAlign = "center";
  speakerDiv.style.width = "130px";

  speakerDiv.addEventListener("click", function () {
    const selectedSpeaker = speakerListElement.querySelector(".selected");

    if (speakerDiv.classList.contains("selected")) {
      speakerDiv.classList.remove("selected");
    } else {
      if (selectedSpeaker) {
        selectedSpeaker.classList.remove("selected");
      }

      speakerDiv.classList.add("selected");
    }

    updateSelections();
  });

  const speakerImageElement = document.createElement("img");

  speakerImageElement.src = speaker.images.default;
  speakerImageElement.alt = speaker.name;
  speakerImageElement.style.width = "100px";
  speakerImageElement.style.height = "100px";
  speakerImageElement.style.objectFit = "cover";
  speakerImageElement.style.display = "block";

  speakerDiv.appendChild(speakerImageElement);

  const speakerTitle = document.createElement("p");

  speakerTitle.style.wordBreak = "break-word";
  speakerTitle.style.overflowWrap = "break-word";
  speakerTitle.textContent = speaker.name;

  speakerDiv.appendChild(speakerTitle);

  const deleteButton = document.createElement("button");

  deleteButton.type = "button";
  deleteButton.classList.add("btn", "btn-sm", "btn-danger");
  deleteButton.textContent = "Delete";
  deleteButton.style.marginLeft = "10px";

  deleteButton.addEventListener("click", function (deleteEvent) {
    deleteEvent.stopPropagation();

    if (isSpeakerUsedByDialogue(speaker.trueID)) {
      alert(
        "This speaker is in use!  Remove/change those dialogue boxes first."
      );
      return;
    }

    const speakerIndex = speakerList.findIndex(
      (item) => item.trueID === speaker.trueID
    );

    if (speakerIndex !== -1) {
      speakerList.splice(speakerIndex, 1);
    }

    speakerDiv.remove();

    updateSelections();
    updateAreaConvoSelections();
  });

  speakerDiv.appendChild(deleteButton);

  speakerListElement.appendChild(speakerDiv);
}
function renderAreaConvo(areaConvo) {
  const areaConvoListElement = document.querySelector(
    "#areaConvoEditingHere #areaConvoList"
  );

  if (!areaConvoListElement || !areaConvo) {
    return;
  }

  const areaConvoDiv = document.createElement("div");

  areaConvoDiv.classList.add("area-convo-entry");
  areaConvoDiv.classList.add("col-12");

  areaConvoDiv.dataset.trueId = areaConvo.trueID;

  areaConvoDiv.style.position = "relative";
  areaConvoDiv.style.margin = "5px";
  areaConvoDiv.style.padding = "10px";
  areaConvoDiv.style.border = "1px solid #afafaf";
  areaConvoDiv.style.borderRadius = "5px";
  areaConvoDiv.style.display = "inline-block";
  areaConvoDiv.style.textAlign = "center";

  const areaConvoImageElement = document.createElement("img");

  areaConvoImageElement.src = areaConvo.imagePath;
  areaConvoImageElement.alt = areaConvo.name;

  areaConvoImageElement.style.minWidth = "150px";
  areaConvoImageElement.classList.add("col-12");
  areaConvoImageElement.style.height = "100px";
  areaConvoImageElement.style.objectFit = "cover";

  areaConvoDiv.appendChild(areaConvoImageElement);

  const areaConvoTitle = document.createElement("p");

  areaConvoTitle.textContent = areaConvo.name;
  areaConvoTitle.style.marginTop = "8px";
  areaConvoTitle.style.marginBottom = "-2px";

  areaConvoDiv.appendChild(areaConvoTitle);

  areaConvoDiv.addEventListener("click", function () {
    const selectedAreaConvo = areaConvoListElement.querySelector(".selected");

    if (areaConvoDiv.classList.contains("selected")) {
      areaConvoDiv.classList.remove("selected");
    } else {
      if (selectedAreaConvo) {
        selectedAreaConvo.classList.remove("selected");
      }

      areaConvoDiv.classList.add("selected");
    }

    updateAreaConvoSelections();
  });

  const deleteButton = document.createElement("button");

  deleteButton.type = "button";
  deleteButton.classList.add("btn", "btn-sm", "btn-danger");

  deleteButton.textContent = "Delete";
  deleteButton.style.marginLeft = "10px";

  deleteButton.addEventListener("click", function (deleteEvent) {
    deleteEvent.stopPropagation();

    const wasSelected = areaConvoDiv.classList.contains("selected");

    const areaConvoIndex = areaConvoList.findIndex(
      (item) => item.trueID === areaConvo.trueID
    );

    if (areaConvoIndex !== -1) {
      areaConvoList.splice(areaConvoIndex, 1);
    }

    areaConvoDiv.remove();

    if (wasSelected) {
      areaConvoSelect = false;
      dialogueSelect = false;
    }

    updateAreaConvoSelections();
  });

  areaConvoDiv.appendChild(deleteButton);

  areaConvoListElement.appendChild(areaConvoDiv);
}
function renderAllData() {
  const speakerListElement = document.querySelector(
    "#speakerEditingHere #speakerList"
  );

  const areaConvoListElement = document.querySelector(
    "#areaConvoEditingHere #areaConvoList"
  );

  const dialogueList = document.getElementById("dialogueList");

  if (speakerListElement) {
    speakerListElement.innerHTML = "";
  }

  if (areaConvoListElement) {
    areaConvoListElement.innerHTML = "";
  }

  if (dialogueList) {
    dialogueList.innerHTML = "";
  }

  speakerSelect = false;
  areaConvoSelect = false;
  dialogueSelect = false;

  speakerList.forEach((speaker) => {
    renderSpeaker(speaker);
  });

  areaConvoList.forEach((areaConvo) => {
    renderAreaConvo(areaConvo);
  });

  updateSelections();
  updateAreaConvoSelections();
}

// Speaker editing

//speaker submit
function submitSpeaker(event) {
  console.log("submitSpeaker triggered");
  if (event) {
    event.preventDefault();
  }

  const speakerName = document.getElementById("speakerNameid").value.trim();
  const speakerColor = document.getElementById("speakerColorId").value.trim();
  const speakerImage = document.getElementById("speakerImageid").value.trim();

  if (!speakerName || !speakerColor || !speakerImage) {
    return;
  }

  const speaker = new Speaker(speakerName, speakerColor, speakerImage);

  speakerList.push(speaker);

  renderSpeaker(speaker);

  document.getElementById("submitSpeakerForm").reset();
}

//speaker update
function populateUpdateSpeakerForm(selectedSpeaker) {
  document.getElementById("updateSpeakerNameid").value = selectedSpeaker.name;

  document.getElementById("updateSpeakerColorId").value = selectedSpeaker.color;

  document.getElementById("updateSpeakerImageid").value =
    selectedSpeaker.images.default;
}

function updateSpeaker(event) {
  if (event) {
    event.preventDefault();
  }

  const selectedSpeaker = getSelectedSpeaker();

  if (!selectedSpeaker) {
    console.error("No speaker selected.");
    return;
  }

  const newName = document.getElementById("updateSpeakerNameid").value.trim();
  const newColor = document.getElementById("updateSpeakerColorId").value.trim();
  const newImage = document.getElementById("updateSpeakerImageid").value.trim();

  if (!newName || !newColor || !newImage) {
    return;
  }

  selectedSpeaker.changeName(newName);
  selectedSpeaker.changeColor(newColor);
  selectedSpeaker.images.default = newImage;

  const selectedSpeakerElement = document.querySelector(
    "#speakerEditingHere #speakerList .selected"
  );

  if (selectedSpeakerElement) {
    const speakerImageElement = selectedSpeakerElement.querySelector("img");

    if (speakerImageElement) {
      speakerImageElement.src = newImage;
      speakerImageElement.alt = newName;
    }

    const speakerTitle = selectedSpeakerElement.querySelector("p");

    if (speakerTitle) {
      speakerTitle.textContent = newName;
    }

    selectedSpeakerElement.style.backgroundColor = newColor;
  }

  renderSpeakerImages(selectedSpeaker);
  if (selectedSpeakerElement) {
    selectedSpeakerElement.classList.remove("selected");
  }
  speakerSelect = false;
  updateSelections();

  console.log("speaker updated ", selectedSpeaker);
}

document.addEventListener("DOMContentLoaded", function () {
  const speakerForm = document.getElementById("submitSpeakerForm");

  if (speakerForm) {
    speakerForm.addEventListener("submit", submitSpeaker);
  }

  const updateSpeakerForm = document.getElementById("updateSpeakerForm");

  if (updateSpeakerForm) {
    updateSpeakerForm.addEventListener("submit", updateSpeaker);
  }

  const speakerImageForm = document.getElementById("submitSpeakerImageForm");

  if (speakerImageForm) {
    speakerImageForm.addEventListener("submit", submitSpeakerImage);
  }

  //area convo
  const areaConvoForm = document.getElementById("submitAreaConvoForm");

  if (areaConvoForm) {
    areaConvoForm.addEventListener("submit", submitAreaConvo);
  }

  const updateAreaConvoForm = document.getElementById("updateAreaConvoForm");

  if (updateAreaConvoForm) {
    updateAreaConvoForm.addEventListener("submit", updateAreaConvo);
  }

  ///dialogue
  const dialogueForm = document.getElementById("submitdialogueForm");

  if (dialogueForm) {
    dialogueForm.addEventListener("submit", submitDialogue);
  }

  const updateDialogueForm = document.getElementById("updatedialogueForm");

  if (updateDialogueForm) {
    updateDialogueForm.addEventListener("submit", updateDialogue);
  }

  const dialogueSpeakerSelect = document.getElementById("dialogueSpeakerid");

  if (dialogueSpeakerSelect) {
    dialogueSpeakerSelect.addEventListener("change", updateAddDialogueImages);
  }

  const updateDialogueSpeakerSelect = document.getElementById(
    "updateDialogueSpeakerid"
  );

  if (updateDialogueSpeakerSelect) {
    updateDialogueSpeakerSelect.addEventListener("change", function () {
      const currentImage = document.getElementById("updateDialogueImageid")
        .value;

      updateEditDialogueImages();

      const imageSelect = document.getElementById("updateDialogueImageid");

      if (
        [...imageSelect.options].some((option) => option.value === currentImage)
      ) {
        imageSelect.value = currentImage;
      }
    });
  }

  new Sortable(document.getElementById("areaConvoList"), {
    animation: 150,
    ghostClass: "dragging",

    onEnd: function () {
      updateAreaConvoOrder();
    }
  });

  new Sortable(document.getElementById("dialogueList"), {
    animation: 150,
    ghostClass: "dragging",

    onEnd: function () {
      updateDialogueOrder();
    }
  });

  //json
  const importDataButton = document.getElementById("importDataButton");
  const exportDataButton = document.getElementById("exportDataButton");
  const importDataInput = document.getElementById("importDataInput");

  if (exportDataButton) {
    exportDataButton.addEventListener("click", exportData);
  }

  if (importDataButton && importDataInput) {
    importDataButton.addEventListener("click", function () {
      importDataInput.click();
    });

    importDataInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = function (readerEvent) {
        try {
          const data = JSON.parse(readerEvent.target.result);

          importData(data);
        } catch (error) {
          console.error("Failed to import JSON:", error);
          alert("Invalid JSON file.");
        }

        importDataInput.value = "";
      };

      reader.readAsText(file);
    });
  }

  //reset on load
  speakerSelect = false;
  areaConvoSelect = false;
  dialogueSelect = false;

  updateSelections();
  updateAreaConvoSelections();
});

// Speaker image editing too
function submitSpeakerImage(event) {
  event.preventDefault();

  const selectedSpeaker = getSelectedSpeaker();

  if (!selectedSpeaker) {
    console.error(
      "no speaker selected.. image editing shouldnt show up tho unless someone does smth weird."
    );
    return; //
  }

  const imageName = document.getElementById("speakerImageNameid").value.trim();

  const imageLink = document.getElementById("speakerImageLinkid").value.trim();

  if (!imageName || !imageLink) {
    return;
  }

  if (imageName === "default") {
    //do not
    return;
  }

  selectedSpeaker.addOverwriteImage(imageLink, imageName);

  renderSpeakerImages(selectedSpeaker);

  document.getElementById("submitSpeakerImageForm").reset();
}

function renderSpeakerImages(selectedSpeaker) {
  const speakerImageList = document.getElementById("speakerImageList");

  if (!speakerImageList) {
    return;
  }

  //clear
  speakerImageList.innerHTML = "";

  if (!selectedSpeaker) {
    return;
  }

  Object.entries(selectedSpeaker.images).forEach(([imageName, imagePath]) => {
    const imageDiv = document.createElement("div");

    imageDiv.classList.add("speaker-image-entry");

    imageDiv.style.position = "relative";
    imageDiv.style.display = "inline-block";
    imageDiv.style.verticalAlign = "top";
    imageDiv.style.margin = "10px";
    imageDiv.style.padding = "10px";
    imageDiv.style.border = "1px solid #afafaf";
    imageDiv.style.borderRadius = "5px";
    imageDiv.style.textAlign = "center";
    imageDiv.style.backgroundColor = "white";
    imageDiv.style.width = "130px";
    imageDiv.style.boxSizing = "border-box";

    const imageElement = document.createElement("img");

    imageElement.src = imagePath;
    imageElement.alt = `${selectedSpeaker.name} - ${imageName}`;
    imageElement.style.width = "100px";
    imageElement.style.height = "100px";
    imageElement.style.objectFit = "cover";
    imageElement.style.display = "block";
    imageElement.style.marginBottom = "8px";

    imageDiv.appendChild(imageElement);

    const imageNameElement = document.createElement("p");

    imageNameElement.textContent = imageName;
    imageNameElement.style.marginBottom = "8px";

    imageDiv.appendChild(imageNameElement);

    if (imageName === "default") {
      const defaultLabel = document.createElement("span");

      defaultLabel.classList.add("btn", "btn-sm", "btn-secondary");
      defaultLabel.textContent = "Default";
      imageDiv.appendChild(defaultLabel);
    } else {
      const deleteButton = document.createElement("button");

      deleteButton.type = "button";
      deleteButton.classList.add("btn", "btn-sm", "btn-danger");

      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", function () {
        selectedSpeaker.removeImage(imageName);
        renderSpeakerImages(selectedSpeaker);
      });

      imageDiv.appendChild(deleteButton);
    }

    speakerImageList.appendChild(imageDiv);
  });
}

// Area convo editing
//basically the same as speaker tbh
function getSelectedAreaConvo() {
  const selectedAreaConvoElement = document.querySelector(
    "#areaConvoEditingHere #areaConvoList .selected"
  );

  if (!selectedAreaConvoElement) {
    return null;
  }

  const selectedAreaConvoID = selectedAreaConvoElement.dataset.trueId;

  const selectedAreaConvo = areaConvoList.find(
    (areaConvo) => areaConvo.trueID === selectedAreaConvoID
  );

  return selectedAreaConvo || null;
}

function submitAreaConvo(event) {
  console.log("submitAreaConvo triggered");

  if (event) {
    event.preventDefault();
  }

  const areaConvoName = document.getElementById("areaConvoNameid").value.trim();

  const areaConvoImage = document
    .getElementById("areaConvoImageid")
    .value.trim();

  if (!areaConvoName || !areaConvoImage) {
    return;
  }

  const areaConvo = new AreaConvoBox(areaConvoName, areaConvoImage);

  areaConvoList.push(areaConvo);

  renderAreaConvo(areaConvo);

  document.getElementById("submitAreaConvoForm").reset();
}

function populateUpdateAreaConvoForm(areaConvo) {
  document.getElementById("updateAreaConvoNameid").value = areaConvo.name;

  document.getElementById("updateAreaConvoImageid").value = areaConvo.imagePath;
}

function updateAreaConvo(event) {
  if (event) {
    event.preventDefault();
  }

  const selectedAreaConvo = getSelectedAreaConvo();

  if (!selectedAreaConvo) {
    console.error("No area convo selected.");
    return;
  }

  const newName = document.getElementById("updateAreaConvoNameid").value.trim();

  const newImage = document
    .getElementById("updateAreaConvoImageid")
    .value.trim();

  if (!newName || !newImage) {
    return;
  }

  selectedAreaConvo.changeName(newName);
  selectedAreaConvo.changeImagePath(newImage);

  const selectedAreaConvoElement = document.querySelector(
    "#areaConvoEditingHere #areaConvoList .selected"
  );

  if (selectedAreaConvoElement) {
    const imageElement = selectedAreaConvoElement.querySelector("img");

    if (imageElement) {
      imageElement.src = newImage;
      imageElement.alt = newName;
    }

    const titleElement = selectedAreaConvoElement.querySelector("p");

    if (titleElement) {
      titleElement.textContent = newName;
    }
  }

  if (selectedAreaConvoElement) {
    selectedAreaConvoElement.classList.remove("selected");
  }

  areaConvoSelect = false;

  updateAreaConvoSelections();

  console.log(" updated", selectedAreaConvo);
}

// Dialogue editing

//helper
function getSelectedDialogueBox() {
  const selectedDialogueElement = document.querySelector(
    "#dialogueEditingHere #dialogueList .selected"
  );

  if (!selectedDialogueElement) {
    return null;
  }

  const selectedDialogueID = selectedDialogueElement.dataset.trueId;

  const selectedAreaConvo = getSelectedAreaConvo();

  if (!selectedAreaConvo) {
    return null;
  }

  const selectedDialogue = selectedAreaConvo.dialogueBoxList.find(
    (dialogueBox) => dialogueBox.trueID === selectedDialogueID
  );

  return selectedDialogue || null;
}

function isSpeakerUsedByDialogue(speakerID) {
  return areaConvoList.some((areaConvo) =>
    areaConvo.dialogueBoxList.some(
      (dialogueBox) => dialogueBox.speakerID === speakerID
    )
  );
}

//populate dropdowns
function populateDialogueSpeakerDropdown(dropdown, selectedSpeakerID = null) {
  if (!dropdown) {
    return;
  }

  dropdown.innerHTML = "";

  speakerList.forEach((speaker) => {
    const option = document.createElement("option");

    option.value = speaker.trueID;
    option.textContent = speaker.name;

    if (selectedSpeakerID && speaker.trueID === selectedSpeakerID) {
      option.selected = true;
    }

    dropdown.appendChild(option);
  });
}

function populateDialogueImageDropdown(
  dropdown,
  speaker,
  selectedImageName = null
) {
  if (!dropdown) {
    return;
  }

  dropdown.innerHTML = "";

  if (!speaker) {
    return;
  }

  Object.keys(speaker.images).forEach((imageName) => {
    const option = document.createElement("option");

    option.value = imageName;
    option.textContent = imageName;

    if (selectedImageName && imageName === selectedImageName) {
      option.selected = true;
    }

    dropdown.appendChild(option);
  });
}

function populateUpdateDialogueForm(dialogueBox) {
  if (!dialogueBox) {
    return;
  }

  const speakerSelect = document.getElementById("updateDialogueSpeakerid");

  const textInput = document.getElementById("updateDialogueTextid");

  const imageSelect = document.getElementById("updateDialogueImageid");

  populateDialogueSpeakerDropdown(speakerSelect, dialogueBox.speakerID);

  textInput.value = dialogueBox.dialogueText;

  const speaker = getSpeakerByID(dialogueBox.speakerID);

  populateDialogueImageDropdown(imageSelect, speaker, dialogueBox.imageName);
}

//updating
function updateAddDialogueImages() {
  const speakerSelect = document.getElementById("dialogueSpeakerid");

  const imageSelect = document.getElementById("dialogueImageid");

  if (!speakerSelect || !imageSelect) {
    return;
  }

  const selectedSpeaker = getSpeakerByID(speakerSelect.value);

  populateDialogueImageDropdown(imageSelect, selectedSpeaker);
}

function updateEditDialogueImages() {
  const speakerSelect = document.getElementById("updateDialogueSpeakerid");

  const imageSelect = document.getElementById("updateDialogueImageid");

  if (!speakerSelect || !imageSelect) {
    return;
  }

  const selectedSpeaker = getSpeakerByID(speakerSelect.value);

  populateDialogueImageDropdown(imageSelect, selectedSpeaker);
}

//atual dialogues
function submitDialogue(event) {
  event.preventDefault();

  const selectedAreaConvo = getSelectedAreaConvo();

  if (!selectedAreaConvo) {
    alert("Please select an area conversation");
    return;
  }

  const speakerID = document.getElementById("dialogueSpeakerid").value;

  const dialogueText = document.getElementById("dialogueTextid").value.trim();

  const imageName = document.getElementById("dialogueImageid").value;

  const selectedSpeaker = getSpeakerByID(speakerID);

  if (!selectedSpeaker || !dialogueText || !imageName) {
    return;
  }
  selectedAreaConvo.addDialogueBox(selectedSpeaker);

  const dialogueBox =
    selectedAreaConvo.dialogueBoxList[
      selectedAreaConvo.dialogueBoxList.length - 1
    ];

  dialogueBox.changeDialogue(dialogueText);

  dialogueBox.changeImageName(imageName);

  renderDialogueBoxes(selectedAreaConvo);

  document.getElementById("submitdialogueForm").reset();

  updateAddDialogueImages();
}

function updateDialogue(event) {
  event.preventDefault();

  const selectedAreaConvo = getSelectedAreaConvo();

  const selectedDialogue = getSelectedDialogueBox();

  if (!selectedAreaConvo || !selectedDialogue) {
    console.error("No dialogue box selected");

    return;
  }

  const speakerID = document.getElementById("updateDialogueSpeakerid").value;

  const dialogueText = document
    .getElementById("updateDialogueTextid")
    .value.trim();

  const imageName = document.getElementById("updateDialogueImageid").value;

  const newSpeaker = getSpeakerByID(speakerID);

  if (!newSpeaker || !dialogueText || !imageName) {
    return;
  }

  selectedDialogue.replaceSpeaker(newSpeaker);

  selectedDialogue.changeDialogue(dialogueText);

  selectedDialogue.changeImageName(imageName);

  const updatedDialogueID = selectedDialogue.trueID;

  renderDialogueBoxes(selectedAreaConvo, updatedDialogueID);

  updateDialogueSelections();
}

function renderDialogueBoxes(selectedAreaConvo, selectedDialogueID = null) {
  const dialogueList = document.getElementById("dialogueList");

  if (!dialogueList) {
    return;
  }

  dialogueList.innerHTML = "";

  if (!selectedAreaConvo) {
    return;
  }

  selectedAreaConvo.dialogueBoxList.forEach((dialogueBox) => {
    const speaker = getSpeakerByID(dialogueBox.speakerID) || dialogueBox.speaker;

    if (!speaker) {
      return;
    }

    const dialogueDiv = document.createElement("div");

    dialogueDiv.classList.add("dialogue-entry-yesyes");
    dialogueDiv.dataset.trueId = dialogueBox.trueID;
    dialogueDiv.style.position = "relative";
    dialogueDiv.style.margin = "10px";
    dialogueDiv.style.padding = "10px";
    dialogueDiv.style.borderRadius = "5px";
    dialogueDiv.style.backgroundColor = "white";

    const row = document.createElement("div");
    row.classList.add("row");

    const imageColumn = document.createElement("div");
    imageColumn.classList.add("col-12", "col-sm-12", "col-md-3");
    const imagePath =
      speaker.images[dialogueBox.imageName] || speaker.images.default;

    const imageElement = document.createElement("img");

    imageElement.src = imagePath;
    imageElement.alt = speaker.name;
    imageElement.style.width = "100px";
    imageElement.style.height = "100px";
    imageElement.style.objectFit = "cover";
    imageElement.style.display = "block";
    imageElement.style.margin = "auto";

    imageColumn.appendChild(imageElement);

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.classList.add("btn", "btn-sm", "btn-danger");
    deleteButton.textContent = "Delete";
    deleteButton.style.display = "block";
    deleteButton.style.margin = "10px auto";

    deleteButton.addEventListener("click", function (deleteEvent) {
      deleteEvent.stopPropagation();

      selectedAreaConvo.removeDialogueBox(dialogueBox.trueID);

      renderDialogueBoxes(selectedAreaConvo);

      updateDialogueSelections();
    });

    imageColumn.appendChild(deleteButton);

    const dialogueColumn = document.createElement("div");
    dialogueColumn.classList.add("col", "text-break", "overflow-auto");
    dialogueColumn.style.minWidth = "0";
    dialogueColumn.style.overflow = "auto";
    // dialogueColumn.style.overflowWrap = "break-word";

    const speakerName = document.createElement("h5");

    speakerName.textContent = speaker.name;
    speakerName.style.color = speaker.color;
    speakerName.style.marginTop = "8px";

    dialogueColumn.appendChild(speakerName);

    const dialogueText = document.createElement("p");

    dialogueText.textContent = dialogueBox.dialogueText;
    dialogueText.style.whiteSpace = "pre-wrap";

    dialogueColumn.appendChild(dialogueText);

    row.appendChild(imageColumn);
    row.appendChild(dialogueColumn);

    dialogueDiv.appendChild(row);

    dialogueDiv.addEventListener("click", function () {
      const currentlySelected = dialogueList.querySelector(".selected");

      if (dialogueDiv.classList.contains("selected")) {
        dialogueDiv.classList.remove("selected");
      } else {
        if (currentlySelected) {
          currentlySelected.classList.remove("selected");
        }

        dialogueDiv.classList.add("selected");
      }

      updateDialogueSelections();
    });

    dialogueList.appendChild(dialogueDiv);

    if (selectedDialogueID && dialogueBox.trueID === selectedDialogueID) {
      dialogueDiv.classList.add("selected");
    }
  });
}

function updateDialogueSelections() {
  const submitForm = document.getElementById("submitdialogueForm");

  const updateForm = document.getElementById("updatedialogueForm");

  const dialogueList = document.getElementById("dialogueList");

  if (!submitForm || !updateForm || !dialogueList) {
    return;
  }

  const selectedAreaConvo = getSelectedAreaConvo();

  if (!selectedAreaConvo) {
    dialogueSelect = false;

    submitForm.style.display = "none";

    updateForm.style.display = "none";

    return;
  }

  const selectedDialogue = getSelectedDialogueBox();
  dialogueSelect = !!selectedDialogue;

  submitForm.style.display = selectedDialogue ? "none" : "block";
  updateForm.style.display = selectedDialogue ? "block" : "none";

  if (selectedDialogue) {
    populateUpdateDialogueForm(selectedDialogue);
  }
}

function updateDialogueAreaConvoSelection() {
  const selectedAreaConvo = getSelectedAreaConvo();

  const dialogueList = document.getElementById("dialogueList");

  const submitDialogueForm = document.getElementById("submitdialogueForm");

  const updateDialogueForm = document.getElementById("updatedialogueForm");

  const dialogueSpeakerSelect = document.getElementById("dialogueSpeakerid");

  if (!dialogueList || !submitDialogueForm || !updateDialogueForm) {
    return;
  }

  if (!selectedAreaConvo) {
    dialogueSelect = false;

    dialogueList.innerHTML = "<p class='p-3'>Select an Area Convo first.</p>";

    submitDialogueForm.style.display = "none";

    updateDialogueForm.style.display = "none";

    if (dialogueSpeakerSelect) {
      dialogueSpeakerSelect.innerHTML = "";
    }

    return;
  }

  //else

  renderDialogueBoxes(selectedAreaConvo);

  populateDialogueSpeakerDropdown(dialogueSpeakerSelect);

  updateAddDialogueImages();

  submitDialogueForm.style.display = "block";

  updateDialogueForm.style.display = "none";

  dialogueSelect = false;
}

////

//update selected divs later
// imagecontrol depends on speakerlist's selection
// speaker images' display depends on speakerlist's selection
// dialogue editing depends on area convo's selection

function updateSelections() {
  const imageControlDiv = document.getElementById("imageControl");
  const submitSpeakerForm = document.getElementById("submitSpeakerForm");
  const updateSpeakerForm = document.getElementById("updateSpeakerForm");

  const speakerListElement = document.querySelector(
    "#speakerEditingHere #speakerList"
  );

  const speakerImageList = document.getElementById("speakerImageList");

  if (
    !imageControlDiv ||
    !submitSpeakerForm ||
    !updateSpeakerForm ||
    !speakerListElement
  ) {
    return;
  }

  const selectedSpeakerElement = speakerListElement.querySelector(".selected");

  speakerSelect = !!selectedSpeakerElement;

  /////////////////////////////////

  //if speaker selected show image controls
  if (!selectedSpeakerElement) {
    imageControlDiv.style.visibility = "collapse";

    submitSpeakerForm.style.display = "block";
    updateSpeakerForm.style.display = "none";

    if (speakerImageList) {
      speakerImageList.innerHTML = "";
    }

    return;
  }

  //else

  const selectedSpeaker = getSelectedSpeaker();

  if (!selectedSpeaker) {
    console.error("Selected speaker not found (?)");
    return;
  }

  imageControlDiv.style.visibility = "visible";

  submitSpeakerForm.style.display = "none"; //
  updateSpeakerForm.style.display = "block";

  //and render

  populateUpdateSpeakerForm(selectedSpeaker);
  renderSpeakerImages(selectedSpeaker);
}

//actually separate it
function updateAreaConvoSelections() {
  const submitForm = document.getElementById("submitAreaConvoForm");

  const updateForm = document.getElementById("updateAreaConvoForm");

  const areaConvoListElement = document.querySelector(
    "#areaConvoEditingHere #areaConvoList"
  );

  if (!submitForm || !updateForm || !areaConvoListElement) {
    return;
  }

  const selectedAreaConvoElement = areaConvoListElement.querySelector(
    ".selected"
  );

  areaConvoSelect = !!selectedAreaConvoElement;

  if (!selectedAreaConvoElement) {
    submitForm.style.display = "block";
    updateForm.style.display = "none";

    updateDialogueAreaConvoSelection();

    return;
  }

  const selectedAreaConvo = areaConvoList.find(
    (areaConvo) => areaConvo.trueID === selectedAreaConvoElement.dataset.trueId
  );

  if (!selectedAreaConvo) {
    console.error("Area Convo not found");

    return;
  }

  submitForm.style.display = "none";
  updateForm.style.display = "block";

  populateUpdateAreaConvoForm(selectedAreaConvo);

  updateDialogueAreaConvoSelection();
}

// //onload
//   updateSelections();
//   updateAreaConvoSelections();

function updateAreaConvoOrder() {
  const orderedIDs = [
    ...document.querySelectorAll("#areaConvoList .area-convo-entry")
  ].map((div) => div.dataset.trueId);

  areaConvoList.sort(
    (a, b) => orderedIDs.indexOf(a.trueID) - orderedIDs.indexOf(b.trueID)
  );
}

function updateDialogueOrder() {
  const selectedAreaConvo = getSelectedAreaConvo();

  if (!selectedAreaConvo) {
    return;
  }

  const orderedIDs = [
    ...document.querySelectorAll("#dialogueList .dialogue-entry-yesyes")
  ].map((div) => div.dataset.trueId);

  selectedAreaConvo.dialogueBoxList.sort(
    (a, b) => orderedIDs.indexOf(a.trueID) - orderedIDs.indexOf(b.trueID)
  );
}

///taken from relatiosnhip area chart lwky

function copyHTML() {
  const exportBox = document.getElementById("exportBox");
  const text = exportBox.textContent;
  const button = document.getElementById("copyButton");

  navigator.clipboard
    .writeText(text)
    .then(() => {
      const originalColor = button.style.backgroundColor;
      button.style.backgroundColor = "green";
      button.textContent = "copied!";
      setTimeout(() => {
        button.style.backgroundColor = originalColor;
        button.textContent = "copy :3";
      }, 1000);
    })
    .catch((err) => {
      console.error(":(");
    });
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br>");
}

function exportData() {
  const data = {
    version: 1,
    speakers: speakerList,
    areaConvos: areaConvoList
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "dialogue-editor-data.json";

  document.body.appendChild(a);
  a.click();

  a.remove();
  URL.revokeObjectURL(url);
}

function importData(data) {
  if (
    !data ||
    !Array.isArray(data.speakers) ||
    !Array.isArray(data.areaConvos)
  ) {
    
    if (Array.isArray(data)) {
      importBackupData(data);
      return;
    }
    
    alert("invalid dialogue editor data..");
    return;
  }

  speakerList = [];
  areaConvoList = [];

  data.speakers.forEach((speakerData) => {
    if (
      !speakerData.trueID ||
      typeof speakerData.name !== "string" ||
      typeof speakerData.color !== "string" ||
      !speakerData.images ||
      typeof speakerData.images !== "object" ||
      typeof speakerData.images.default !== "string"
    ) {
      console.log("Skipping invalid speaker:", speakerData);
      return;
    }

    const speaker = new Speaker(
      speakerData.name,
      speakerData.color,
      speakerData.images.default
    );

    speaker.trueID = speakerData.trueID;
    speaker.images = { ...speakerData.images };

    speakerList.push(speaker);
  });

  data.areaConvos.forEach((areaConvoData) => {
    if (
      !areaConvoData.trueID ||
      typeof areaConvoData.name !== "string" ||
      typeof areaConvoData.imagePath !== "string" ||
      !Array.isArray(areaConvoData.dialogueBoxList)
    ) {
      console.log("Skipping invalid area convo:", areaConvoData);
      return;
    }

    const areaConvo = new AreaConvoBox(
      areaConvoData.name,
      areaConvoData.imagePath
    );

    areaConvo.trueID = areaConvoData.trueID;
    areaConvoData.dialogueBoxList.forEach((dialogueData) => {
      const speaker = getSpeakerByID(dialogueData.speakerID);

      if (!speaker) {
        console.log("Skipping dialogue with missing speaker:", dialogueData);
        return;
      }

      const dialogueBox = new DialogueBox(speaker);

      dialogueBox.trueID = dialogueData.trueID;
      dialogueBox.speakerID = dialogueData.speakerID;
      dialogueBox.dialogueText = dialogueData.dialogueText;
      dialogueBox.imageName = dialogueData.imageName;

      if (!(dialogueBox.imageName in speaker.images)) {
        dialogueBox.imageName = "default";
      }

      areaConvo.dialogueBoxList.push(dialogueBox);
    });

    areaConvoList.push(areaConvo);
  });

  renderAllData();

  alert("data imported successfully!");
}

//ignore this its solely for me and my fuckoff 2000+ csv
function importBackupData(data) {
  if (!Array.isArray(data)) {
    alert("invalid backup data..");
    return;
  }

  areaConvoList = [];
  const backupSpeakers = {};

  data.forEach((areaConvoData) => {
    if (
      areaConvoData.areaConvoID === undefined ||
      typeof areaConvoData.areaConvoImage !== "string" ||
      !Array.isArray(areaConvoData.dialogue)
    ) {
      console.log(
        "Skipping invalid backup area convo:",
        areaConvoData
      );
      return;
    }

    const areaConvo = new AreaConvoBox(
      String(areaConvoData.areaConvoID),
      areaConvoData.areaConvoImage
    );

    areaConvoData.dialogue.forEach((dialogueData) => {
      if (
        dialogueData.talkspriteID === undefined ||
        typeof dialogueData.display !== "string" ||
        typeof dialogueData.dialogue !== "string"
      ) {
        console.log(
          "Skipping invalid backup dialogue:",
          dialogueData
        );
        return;
      }

      const talkspriteID = String(dialogueData.talkspriteID);
      const speakerName = dialogueData.display;

      const speakerKey = `${speakerName}|||${talkspriteID}`;
      let speaker = backupSpeakers[speakerKey];

      if (!speaker) {
        const speakerColor =
          typeof dialogueData.color === "string" && dialogueData.color.trim()
            ? dialogueData.color.trim()
            : "#33AAEE";

        speaker = new Speaker(
          speakerName,
          speakerColor,
          talkspriteID
        );

        speaker.images = {
          default: talkspriteID
        };

        backupSpeakers[speakerKey] = speaker;
      }

      const dialogueBox = new DialogueBox(speaker);

      dialogueBox.speakerID = null;
      dialogueBox.speaker = speaker;
      dialogueBox.dialogueText = dialogueData.dialogue;
      dialogueBox.imageName = "default";

      areaConvo.dialogueBoxList.push(dialogueBox);
    });

    areaConvoList.push(areaConvo);
  });
  exportToHTML();

  alert(`test backup worked! ${areaConvoList.length} conversation(s) imported`);
  alert(`this wont show in the editor, it only exports html`); 
}


function exportToHTML() {
  const exportBox = document.getElementById("exportBox");

  if (!exportBox) {
    return;
  }

  let html = `
<div class="mx-auto" style="max-width:800px;">

  <!-- tab control -->

  <div
    class="accordion md-accordion"
    id="allclosed"
    role="tablist"
    aria-multiselectable="true"
  >
`;

  areaConvoList.forEach((areaConvo, areaIndex) => {
    const accordionNumber = areaIndex + 1;
    const headingID = `headingclosed${accordionNumber}`;
    const collapseID = `allclosed${accordionNumber}`;

    html += `
    <!-- !!EDIT!! -->
    <!-- here all controls are denoted by allclosed${accordionNumber}-->
    <div>

      <!--toggle visual -->
      <!-- !!EDIT!! edit background-image:url here -->
      <div
        class="card p-3 mb-2"
        role="tab"
        id="${headingID}"
        style="
          clip-path: polygon(8% 0, 100% 0%, 100% 100%, 8% 100%, 0% 50%);
          background-size: cover;
          background-position: center;
          background-image:url('${escapeHTML(areaConvo.imagePath)}');
          text-align: right;
          border: none;
        "
      >
        <a
          data-toggle="collapse"
          data-parent="#allclosed"
          href="#${collapseID}"
          aria-expanded="false"
          aria-controls="${collapseID}"
        >
          <div class="mb-0">
            <h2 style="text-shadow: #ddffb6 1px 0 10px; letter-spacing: 1px">
              <span
                class="far"
                style="color: black; margin-right: 75px"
              >
                ${escapeHTML(areaConvo.name)}
              </span>
            </h2>
          </div>
        </a>
      </div>

      <!--content -->
      <div
        id="${collapseID}"
        class="collapse"
        role="tabpanel"
        aria-labelledby="${headingID}"
        data-parent="#allclosed"
      >

        <!-- DIALOGUE START -->
        <div
          class="card"
          style="
            min-height:100px;
            padding: 15px 25px 15px 35px;
            margin: 25px;
          "
        >
`;

    areaConvo.dialogueBoxList.forEach((dialogueBox) => {
      const speaker = getSpeakerByID(dialogueBox.speakerID) || dialogueBox.speaker;

      if (!speaker) {
        return;
      }

      const imagePath =
        speaker.images[dialogueBox.imageName] || speaker.images.default;

      html += `
          <!-- SPEECHBOX START -->
          <div
            class="row no-gutters justify-content-center"
            style="margin: 10px 0px 10px 0px;"
          >

            <!-- icon -->
            <!-- !!EDIT!! background-image url should be changed! -->
            <div
              class="card col-md-2 col-4 p-1  align-items-center"
              style="
                border: none;
                border-radius: 25px;
                overflow: hidden;
                width: 100%;
                height: 125px;
                min-height: 75px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                background-image:url('${escapeHTML(imagePath)}');
              "
            >
            </div>

            <!-- textbox -->
            <div
              class="card col-md-10 col-8 p-1"
              style="border: none;"
            >

              <div
                class="bg-faded p-4 h-100"
                style="
                  clip-path: polygon(
                    0% 0%,
                    100% 0%,
                    100% 85%,
                    24% 85%,
                    0 100%,
                    10% 85%,
                    0% 85%
                  );
                  margin-left: 20px;
                  border-radius: 5px;
                  min-height: 100px;
                  border-top: 10px solid ${escapeHTML(speaker.color)};
                "
              >

                <!-- !!EDIT!! text here! -->
                <p
                  align="center"
                  style="white-space: pre-wrap;"
                >${escapeHTML(dialogueBox.dialogueText)}</p>
                <br>
                <br>
              </div>

              <!-- !!EDIT!! replace #33AAEE with whatever color u want-->
              <div
                class="bg-faded p-12 h-100"
                style="
                  margin: -25px 0px 0px 0px;
                  margin-left: auto;
                  background-color: ${escapeHTML(speaker.color)};
                  z-index: 10;
                  width: 25%;
                  min-width: 75px; 
                  border-radius: 5px;
                  max-height: 25px;
                "
              >

                <!-- !!EDIT!! edit name here! -->
                <p align="center">${escapeHTML(speaker.name)}</p>

              </div>

            </div>
          </div>
          <!-- SPEECHBOX END -->
`;
    });

    html += `
        </div>
        <!-- DIALOGUE END  -->

      </div>
    </div>
`;
  });

  html += `
  </div>
</div>
`;

  exportBox.textContent = html;
}

