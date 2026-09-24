
var speakerSelect = false;
var areaConvoSelect = false;
var dialogueSelect = false;

var speakerList = [];
var areaConvoList = [];
//global #sorry

//areaconvo contains dialoguelist
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
    }
    else {
      this.imageName = "default";
    }
    
  }

  changeImageName(newImageName) {
    const currentSpeaker = speakerList.find(
      speaker => speaker.trueID === this.speakerID
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
  
  reorderDialogueBox() {
    
  }
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
      dialogueBox => dialogueBox.trueID === dialogueBoxID
    );

    if (index === -1) {
      console.error("DialogueBox not found .......");
      return;
    }

    this.dialogueBoxList.splice(index, 1);
  }
}

//////////////////////////////


// Speaker editing

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
  speaker => speaker.trueID === selectedSpeakerID
);

return selectedSpeaker || null;
}

//speaker submit
function submitSpeaker(event) {
  console.log("submitSpeaker triggered")
  if (event) {
    event.preventDefault();
  }

  const speakerName = document.getElementById("speakerNameid").value.trim();
  const speakerColor = document.getElementById("speakerColorId").value.trim();
  const speakerImage = document.getElementById("speakerImageid").value.trim();
  const speakerListElement = document.querySelector(
    "#speakerEditingHere #speakerList"
  );

  if (!speakerListElement || !speakerName || !speakerColor || !speakerImage) {
    return;
  }

  const speaker = new Speaker(speakerName, speakerColor, speakerImage);
  speakerList.push(speaker);

  const speakerDiv = document.createElement("div");
  speakerDiv.classList.add("speaker-entry");
  speakerDiv.dataset.trueId = speaker.trueID;
  speakerDiv.style.position = "relative";
  speakerDiv.style.marginBottom = "15px";
  speakerDiv.style.marginRight = "10px";
  speakerDiv.style.padding = "5px";
  speakerDiv.style.border = "1px solid #afafafff";
  speakerDiv.style.borderRadius = "8px";
  speakerDiv.style.display = "inline-block";
  speakerDiv.style.textAlign = "center";
  speakerDiv.style.cursor = "pointer";

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
  speakerImageElement.src = speakerImage;
  speakerImageElement.alt = speakerName;
  speakerImageElement.style.width = "100px";
  speakerImageElement.style.height = "100px";
  speakerImageElement.style.objectFit = "cover";
  speakerImageElement.style.display = "block";
  speakerDiv.appendChild(speakerImageElement);

  const speakerTitle = document.createElement("p"); 
  speakerTitle.textContent = speakerName; 
  speakerDiv.appendChild(speakerTitle);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.classList.add("btn", "btn-sm", "btn-danger");
  deleteButton.textContent = "Delete";
  deleteButton.style.marginLeft = "10px";
  deleteButton.addEventListener("click", function (deleteEvent) {
    deleteEvent.stopPropagation();

    const speakerIndex = speakerList.findIndex(
      (item) => item.trueID === speaker.trueID
    );

    if (speakerIndex !== -1) {
      speakerList.splice(speakerIndex, 1);
    }

    speakerDiv.remove();
    updateSelections();
  });
  speakerDiv.appendChild(deleteButton);

  speakerListElement.appendChild(speakerDiv);
  document.getElementById("submitSpeakerForm").reset();
}
//speaker update
function populateUpdateSpeakerForm(selectedSpeaker) {
  document.getElementById("updateSpeakerNameid").value =
    selectedSpeaker.name;

  document.getElementById("updateSpeakerColorId").value =
    selectedSpeaker.color;

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

  const newName = document
    .getElementById("updateSpeakerNameid")
    .value
    .trim();

  const newColor = document
    .getElementById("updateSpeakerColorId")
    .value
    .trim();

  const newImage = document
    .getElementById("updateSpeakerImageid")
    .value
    .trim();

  if (!newName || !newColor || !newImage) {
    return;
  }

  selectedSpeaker.changeName(newName);
  selectedSpeaker.changeColor(newColor);
  selectedSpeaker.images.default = newImage;

  
  const selectedSpeakerElement =
    document.querySelector(
      "#speakerEditingHere #speakerList .selected"
    );

  if (selectedSpeakerElement) {

    const speakerImageElement =
      selectedSpeakerElement.querySelector("img");

    if (speakerImageElement) {
      speakerImageElement.src = newImage;
      speakerImageElement.alt = newName;
    }

    const speakerTitle =
      selectedSpeakerElement.querySelector("p");
    if (speakerTitle) {
      speakerTitle.textContent = newName;
    }
  }

  renderSpeakerImages(selectedSpeaker);
  console.log("speaker updated ", selectedSpeaker);
}

document.addEventListener("DOMContentLoaded", function () {
  const speakerForm =
    document.getElementById("submitSpeakerForm");

  if (speakerForm) {
    speakerForm.addEventListener("submit", submitSpeaker);
  }

  const updateSpeakerForm =
    document.getElementById("updateSpeakerForm");

  if (updateSpeakerForm) {
    updateSpeakerForm.addEventListener(
      "submit",
      updateSpeaker
    );
  }

  const speakerImageForm =
    document.getElementById("submitSpeakerImageForm");

  if (speakerImageForm) {
    speakerImageForm.addEventListener(
      "submit",
      submitSpeakerImage
    );
  }
  
  //area convo
  const areaConvoForm =
    document.getElementById(
      "submitAreaConvoForm"
    );

  if (areaConvoForm) {
    areaConvoForm.addEventListener(
      "submit",
      submitAreaConvo
    );
  }


  const updateAreaConvoForm =
    document.getElementById(
      "updateAreaConvoForm"
    );

  if (updateAreaConvoForm) {
    updateAreaConvoForm.addEventListener(
      "submit",
      updateAreaConvo
    );
  }


  updateSelections();
  updateAreaConvoSelections();
});

// Speaker image editing too
function submitSpeakerImage(event) {
  event.preventDefault();

  const selectedSpeaker = getSelectedSpeaker();
  if (!selectedSpeaker) {
    console.error("no speaker selected.. image editing shouldnt show up tho unless someone does smth weird.");
    return; //
  }

  const imageName = document
    .getElementById("speakerImageNameid")
    .value
    .trim();

  const imageLink = document
    .getElementById("speakerImageLinkid")
    .value
    .trim();

  if (!imageName || !imageLink) {
    return;
  }
 
  if (imageName === "default") { //do not
    return;
  } 
  selectedSpeaker.addOverwriteImage(imageLink, imageName);

  renderSpeakerImages(selectedSpeaker);

  document.getElementById("submitSpeakerImageForm").reset();
}
function renderSpeakerImages(selectedSpeaker) {
  const speakerImageList =
    document.getElementById("speakerImageList");

  if (!speakerImageList) {
    return;
  }
 //clear
  speakerImageList.innerHTML = "";

  if (!selectedSpeaker) {
    return;
  }

  Object.entries(selectedSpeaker.images).forEach(
    ([imageName, imagePath]) => {

      const imageDiv = document.createElement("div");

      imageDiv.classList.add("speaker-image-entry");

      imageDiv.style.position = "relative";
      imageDiv.style.display = "inline-block";
      imageDiv.style.verticalAlign = "top";
      imageDiv.style.margin = "10px";
      imageDiv.style.padding = "10px";
      imageDiv.style.border = "1px solid #afafaf";
      imageDiv.style.borderRadius = "8px";
      imageDiv.style.textAlign = "center";
      imageDiv.style.backgroundColor = "white";

      const imageElement = document.createElement("img");

      imageElement.src = imagePath;
      imageElement.alt = `${selectedSpeaker.name} - ${imageName}`;
      imageElement.style.width = "120px";
      imageElement.style.height = "120px";
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

        defaultLabel.classList.add(
          "btn",
          "btn-sm",
          "btn-secondary"
        );
        defaultLabel.textContent = "Default";
        imageDiv.appendChild(defaultLabel);

      } else {

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.classList.add(
          "btn",
          "btn-sm",
          "btn-danger"
        );

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
          selectedSpeaker.removeImage(imageName);
          renderSpeakerImages(selectedSpeaker);
        });

        imageDiv.appendChild(deleteButton);
      }

      speakerImageList.appendChild(imageDiv);
    }
  );
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

  const selectedAreaConvoID =
    selectedAreaConvoElement.dataset.trueId;

  const selectedAreaConvo = areaConvoList.find(
    areaConvo => areaConvo.trueID === selectedAreaConvoID
  );

  return selectedAreaConvo || null;
}

function submitAreaConvo(event) {
  console.log("submitAreaConvo triggered");

  if (event) {
    event.preventDefault();
  }

  const areaConvoName = document
    .getElementById("areaConvoNameid")
    .value
    .trim();

  const areaConvoImage = document
    .getElementById("areaConvoImageid")
    .value
    .trim();

  const areaConvoListElement = document.querySelector(
    "#areaConvoEditingHere #areaConvoList"
  );

  if (
    !areaConvoListElement ||
    !areaConvoName ||
    !areaConvoImage
  ) {
    return;
  }

  const areaConvo = new AreaConvoBox(
    areaConvoName,
    areaConvoImage
  );

  areaConvoList.push(areaConvo);

 
  const areaConvoDiv = document.createElement("div"); 
  areaConvoDiv.classList.add("area-convo-entry");
  areaConvoDiv.classList.add("col-12");

  areaConvoDiv.dataset.trueId = areaConvo.trueID;

  areaConvoDiv.style.position = "relative";
  areaConvoDiv.style.margin = "5px"; 
  areaConvoDiv.style.padding = "10px";
  areaConvoDiv.style.border = "1px solid #afafaf";
  areaConvoDiv.style.borderRadius = "8px";
  areaConvoDiv.style.display = "inline-block";
  areaConvoDiv.style.textAlign = "center";
  areaConvoDiv.style.cursor = "pointer";

 
  const areaConvoImageElement =
    document.createElement("img");

  areaConvoImageElement.src = areaConvoImage;
  areaConvoImageElement.alt = areaConvoName;

  areaConvoImageElement.style.minWidth = "150px";
  areaConvoImageElement.classList.add("col-12");
  areaConvoImageElement.style.height = "100px";
  areaConvoImageElement.style.objectFit = "cover";

  areaConvoDiv.appendChild(areaConvoImageElement);


  const areaConvoTitle =
    document.createElement("p");

  areaConvoTitle.textContent = areaConvoName;
  areaConvoTitle.style.marginTop = "8px";
  areaConvoTitle.style.marginBottom = "-2px";
  areaConvoDiv.appendChild(areaConvoTitle);


  // Click to select
  areaConvoDiv.addEventListener("click", function () {

    const selectedAreaConvo =
      areaConvoListElement.querySelector(".selected");

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
  deleteButton.classList.add(
    "btn",
    "btn-sm",
    "btn-danger"
  );

  deleteButton.textContent = "Delete";
  deleteButton.style.marginLeft = "10px";
  deleteButton.addEventListener(
    "click",
    function (deleteEvent) {

      deleteEvent.stopPropagation();

      const areaConvoIndex =
        areaConvoList.findIndex(
          item =>
            item.trueID === areaConvo.trueID
        );

      if (areaConvoIndex !== -1) {
        areaConvoList.splice(
          areaConvoIndex,
          1
        );
      }

      areaConvoDiv.remove();
      updateAreaConvoSelections();
    }
  );


  areaConvoDiv.appendChild(deleteButton);
  areaConvoListElement.appendChild(areaConvoDiv);

 
  document
    .getElementById("submitAreaConvoForm")
    .reset();
}
function populateUpdateAreaConvoForm(areaConvo) {

  document.getElementById(
    "updateAreaConvoNameid"
  ).value = areaConvo.name;

  document.getElementById(
    "updateAreaConvoImageid"
  ).value = areaConvo.imagePath;
}
function updateAreaConvo(event) {
  if (event) {
    event.preventDefault();
  }

  const selectedAreaConvo =
    getSelectedAreaConvo();

  if (!selectedAreaConvo) {
    console.error("No area convo selected.");
    return;
  }


  const newName = document
    .getElementById("updateAreaConvoNameid")
    .value
    .trim();

  const newImage = document
    .getElementById("updateAreaConvoImageid")
    .value
    .trim();


  if (!newName || !newImage) {
    return;
  }


  selectedAreaConvo.changeName(newName);
  selectedAreaConvo.changeImagePath(newImage);

  const selectedAreaConvoElement =
    document.querySelector(
      "#areaConvoEditingHere #areaConvoList .selected"
    );

  if (selectedAreaConvoElement) {

    const imageElement =
      selectedAreaConvoElement.querySelector("img");

    if (imageElement) {
      imageElement.src = newImage;
      imageElement.alt = newName;
    }


    const titleElement =
      selectedAreaConvoElement.querySelector("p");

    if (titleElement) {
      titleElement.textContent = newName;
    }
  }

  console.log(" updated",  selectedAreaConvo);
}



// Dialogue editing



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

  const selectedSpeakerElement =
    speakerListElement?.querySelector(".selected");

  speakerSelect = !!selectedSpeakerElement;
  
  
  /////////////////////////////////

  //if speaker selected show image controls
  if (!selectedSpeakerElement) {
    imageControlDiv.style.visibility = "collapse";
    
    submitSpeakerForm.style.display = "block";
    updateSpeakerForm.style.display = "none";

    // Clear image list
    if (speakerImageList) {
      speakerImageList.innerHTML = "";
    }

    return;
  }
 
  //else

  const selectedSpeaker = speakerList.find(
    speaker =>
      speaker.trueID === selectedSpeakerElement.dataset.trueId
  );

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

  const submitForm =
    document.getElementById(
      "submitAreaConvoForm"
    );

  const updateForm =
    document.getElementById(
      "updateAreaConvoForm"
    );


  const areaConvoListElement =
    document.querySelector(
      "#areaConvoEditingHere #areaConvoList"
    );


  if (!submitForm || !updateForm || !areaConvoListElement) {
    return;
  }
  const selectedAreaConvoElement =
    areaConvoListElement.querySelector(
      ".selected"
    );


  areaConvoSelect = !!selectedAreaConvoElement;

  if (!selectedAreaConvoElement) {

    submitForm.style.display = "block";
    updateForm.style.display = "none";
    return;
  }
  
  const selectedAreaConvo =
    areaConvoList.find(
      areaConvo =>
        areaConvo.trueID ===
        selectedAreaConvoElement.dataset.trueId
    );


  if (!selectedAreaConvo) {
    console.error("not found");
    return;
  }


  submitForm.style.display = "none";
  updateForm.style.display = "block";


  populateUpdateAreaConvoForm(
    selectedAreaConvo
  );
}


//onload
  updateSelections();
  updateAreaConvoSelections();
