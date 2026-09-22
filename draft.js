
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

//orderid + sortable js will be here eventually
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
