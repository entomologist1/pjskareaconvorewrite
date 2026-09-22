
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
  constructor(imagePath) {
    this.imagePath = imagePath;
    this.dialogueBoxList = [];
    //skip if empty when exporting
  }

  addDialogueBox(speaker) {
    this.dialogueBoxList.push(new DialogueBox(speaker));
  }

  removeDialogueBox(dialogueBoxID) {
    const index = this.dialogueBoxList.findIndex(
      dialogueBox => dialogueBox.trueID == dialogueBoxID
    );

    if (index === -1) {
      console.error("DialogueBox not found ....... ");
      return;
    }

    this.dialogueBoxList.splice(index, 1); //
  }
} 


// Speaker editing
function submitSpeaker(event) {
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
      speakerSelect = false;
      speakerDiv.classList.remove("selected");
      return;
    }

    if (selectedSpeaker) {
      speakerSelect = false;
      selectedSpeaker.classList.remove("selected");
    }

    speakerDiv.classList.add("selected");
    speakerSelect = true;
    
    // console.log(speakerSelect)
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
  });
  speakerDiv.appendChild(deleteButton);

  speakerListElement.appendChild(speakerDiv);
  document.getElementById("submitSpeakerForm").reset();
}

document.addEventListener("DOMContentLoaded", function () {
  const speakerForm = document.getElementById("submitSpeakerForm");

  if (speakerForm) {
    speakerForm.addEventListener("submit", submitSpeaker);
  }
});

// Area convo editing

// Dialogue editing
