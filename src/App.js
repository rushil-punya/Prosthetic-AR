import './App.css';
import React, {useRef} from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import foot from "./l2.png";
import arm from "./arm.png";


//GENERAL OUTLINE\\
/*1. Initiate webcam 
  2. Get body model data
  3. Make sure body part is in frame
  4. Determine optimal position of image overlay through triangulation
  5. Determine slope of limb relative to camera frame
  6. Determine image angle of transposition using quadratic regression
  7. Place image
  8. Repeat
*/

// 0 = nothing is amputated
// 1 = left Leg
// 2 = right leg
// 3 = left arm
// 4 = right arm
var amputated = 0;
var james = tf;
console.log(james);

//BUTTON SELECTION FUNCTIONS\\
function leftLeg() {
  alert("left leg selected");
  amputated = 1;
  document.getElementById("bro").style.display="block";
  document.getElementById("pro").style.display="none";
  console.log("hit Left Leg Selected", amputated);
}

function rightLeg() {
  alert("right leg selected")
  amputated = 2;
  document.getElementById("bro").style.display="block";
  document.getElementById("pro").style.display="none";
  console.log("hit Right Leg Selected", amputated);
}

function leftArm() {
  alert("left arm selected")
  amputated = 3;
  document.getElementById("pro").style.display="block";
  document.getElementById("bro").style.display="none";
  console.log("hit Left Arm Selected", amputated);
}

function rightArm() {
  alert("right arm selected");
  amputated = 4;
  document.getElementById("pro").style.display="block";
  document.getElementById("bro").style.display="none";
  console.log("hit Right Arm Selected", amputated);
}



function RightArmPredict(detect) {
  try {
    var shoulderX = detect.allPoses[0].keypoints[6].position.x 
    var shoulderY = detect.allPoses[0].keypoints[6].position.y
    var shoulderScore = detect.allPoses[0].keypoints[6].score
    var elbowX = detect.allPoses[0].keypoints[8].position.x
    var elbowY = detect.allPoses[0].keypoints[8].position.y
    var elbowScore = detect.allPoses[0].keypoints[8].score
  } catch (error) {
    
  }
  if(shoulderScore >= .75 && elbowScore >= .75)
  {
    

    var yOffset = (elbowY- shoulderY)
    var xOffset = (elbowX-shoulderX)
    var newX = elbowX+ xOffset
    var newY = elbowY + yOffset 
    var answer = [newX, newY];
    var item = document.getElementById("pro");
    var webcam = document.getElementById("webcam")

    var x2 = answer[0]/1.2 + webcam.offsetLeft;
    var y2 = webcam.offsetTop + answer[1]/1.6;
    

    var slope = Math.abs(shoulderY-elbowY) / Math.abs(shoulderX-elbowX)
    // when slope = 1 => 315 degree rotation
    // when slope = 0 => 270 degree rotation  
    //rotation magic: 
    // regression formula:
    var rotation = 90 + (-52.5*slope) + (slope * slope * 7.5);
    if (slope >= 4) {
      rotation = 0;
    }
    if (rotation >= 90) {
      rotation = 90;
    }
    if (rotation <= 0) {
      rotation = 0;
    }
    var transform = 'transform:rotate(' + rotation + 'deg)';
    item.style = transform;
    item.style.display = '';
    item.style.position = 'absolute';
    item.style.left = x2 + 'px';
    item.style.top = y2 + 'px';
    item.style.height = 125 + 0.75*(elbowY- shoulderY) + 'px';
    item.style.width = 75 + 0.25*(elbowX - shoulderX) + 'px';
  }
}

function LeftArmPredict(detect) {
  try {
    var shoulderX = detect.allPoses[0].keypoints[5].position.x 
    var shoulderY = detect.allPoses[0].keypoints[5].position.y
    var shoulderScore = detect.allPoses[0].keypoints[5].score
    var elbowX = detect.allPoses[0].keypoints[7].position.x
    var elbowY = detect.allPoses[0].keypoints[7].position.y
    var elbowScore = detect.allPoses[0].keypoints[7].score
  } catch (error) {
    
  }
  if(shoulderScore >= .75 && elbowScore >= .75)
  {
    

    var yOffset = (elbowY- shoulderY)
    var xOffset = (elbowX-shoulderX)
    var newX = elbowX+ xOffset
    var newY = elbowY + yOffset 
    var answer = [newX, newY];

    var item = document.getElementById("pro");
    // var x2 = answer[0] + 870;
    // var y2 = answer[1] + 625;
    var webcam = document.getElementById("webcam")

    var x2 = answer[0]/1.2 + webcam.offsetLeft;
    var y2 = webcam.offsetTop + answer[1]/1.6;

    var slope = Math.abs(shoulderY-elbowY) / Math.abs(shoulderX-elbowX)
    // when slope = 1 => 315 degree rotation
    // when slope = 0 => 270 degree rotation  
    //rotation magic: 
    // regression formula:
    var rotation = 270 + (53.5 * slope) + (-7.5 * slope * slope);
    if (slope >= 4) {
      rotation = 360;
    }
    if (rotation >= 360) {
      rotation = 360;
    }
    if (rotation <= 0) {
      rotation = 0;
    }
    console.log("hit", rotation, slope);
    var transform = 'transform:rotate(' + rotation + 'deg)';
    item.style = transform;
    item.style.display = '';
    item.style.position = 'absolute';
    item.style.left = x2 + 'px';
    item.style.top = y2 + 'px';
    item.style.height = 125 + 0.75*(elbowY- shoulderY) + 'px';
    item.style.width = 75 + 0.25*(elbowX - shoulderX) + 'px';
   
  }
}

function RightLegPredict(detect) {
  try {
    var hipX = detect.allPoses[0].keypoints[12].position.x 
    var hipY = detect.allPoses[0].keypoints[12].position.y
    var hipScore = detect.allPoses[0].keypoints[12].score
    var kneeX = detect.allPoses[0].keypoints[14].position.x
    var kneeY = detect.allPoses[0].keypoints[14].position.y
    var kneeScore = detect.allPoses[0].keypoints[14].score
  } catch (error) {
    
  }
  
  if(hipScore >= .85 && kneeScore >= .85)
  {

    var yOffset = .7*(kneeY - hipY)
    var xOffset = .7*(kneeX - hipX)
    var newX = kneeX + xOffset
    var newY = kneeY + yOffset 
    var answer = [newX, newY];
    var item = document.getElementById("bro");
    var webcam = document.getElementById("webcam")

    var x2 = answer[0]/1.5 + webcam.offsetLeft;
    var y2 = webcam.offsetTop + answer[1]/1.6;
    

    var slope = Math.abs(hipY-kneeY) / Math.abs(hipX-kneeX)
    // when slope = 1 => 315 degree rotation
    // when slope = 0 => 270 degree rotation  
    //rotation magic: 
    // regression formula:
    var rotation = 90 + (-52.5*slope) + (slope * slope * 7.5);
    if (slope >= 4) {
      rotation = 0;
    }
    if (rotation >= 90) {
      rotation = 90;
    }
    if (rotation <= 0) {
      rotation = 0;
    }
    var transform = 'transform:rotate(' + rotation + 'deg)';
    item.style = transform;
    item.style.display = '';
    item.style.position = 'absolute';
    item.style.left = x2 + 'px';
    item.style.top = y2 + 'px';
    item.style.height = 125 + 0.75*(kneeY- hipY) + 'px';
    item.style.width = 75 + (kneeX - hipY) + 'px';    
    
  }
}

function LeftLegPredict(detect) {
  try {
    var hipX = detect.allPoses[0].keypoints[11].position.x 
    var hipY = detect.allPoses[0].keypoints[11].position.y
    var hipScore = detect.allPoses[0].keypoints[11].score
    var kneeX = detect.allPoses[0].keypoints[13].position.x
    var kneeY = detect.allPoses[0].keypoints[13].position.y
    var kneeScore = detect.allPoses[0].keypoints[13].score
  } catch (error) {
    
  }

  if(hipScore >= .85 && kneeScore >= .85)
  {
    

    var yOffset = .7*(kneeY - hipY)
    var xOffset = .7*(kneeX - hipX)
    var newX = kneeX + xOffset
    var newY = kneeY + yOffset 
    var answer = [newX, newY];
   
    var item = document.getElementById("bro");
    // var x2 = answer[0] + 870;
    // var y2 = answer[1] + 625;
    var webcam = document.getElementById("webcam")

    var x2 = answer[0]/1.5 + webcam.offsetLeft;
    var y2 = webcam.offsetTop + answer[1]/1.6;

    var slope = Math.abs(hipY-kneeY) / Math.abs(hipX-kneeX)
    // when slope = 1 => 315 degree rotation
    // when slope = 0 => 270 degree rotation  
    //rotation magic: 
    // regression formula:
    var rotation = 270 + (53.5 * slope) + (-7.5 * slope * slope);
    if (slope >= 4) {
      rotation = 360;
    }
    if (rotation >= 360) {
      rotation = 360;
    }
    if (rotation <= 0) {
      rotation = 0;
    }
    console.log("hit", rotation, slope);
    var transform = 'transform:rotate(' + rotation + 'deg)';
    item.style = transform;
    item.style.display = '';
    item.style.position = 'absolute';
    item.style.left = x2 + 'px';
    item.style.top = y2 + 'px';
    item.style.height = 125 + 0.75*(kneeY- hipY) + 'px';
    item.style.width = 75 + (kneeX - hipY) + 'px';
  }
}



function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runBodysegment = async () => {
    const net = await bodyPix.load();
    console.log("Bodypix model loaded.")
    setInterval(() => {
      detect(net);
    }, .01);
  };

  const detect = async (net) =>{
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null && 
      webcamRef.current.video.readyState === 4
    ) {
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
        const detect = await net.segmentPersonParts(video);
        

        if (amputated === 4) {
          //RIGHT ARM\\
          try {
            RightArmPredict(detect)
            //console.log("Predict X", answer[0], "Predict Y", answer[1])

          } catch (error) {
            console.log("Could not determine arm position model")
          }
        }
        else if (amputated === 3) {
          //LEFT ARM\\
          try {
            LeftArmPredict(detect);
            //console.log("Predict X", answer[0], "Predict Y", answer[1])
          } catch (error) {
            console.log("Could not determine arm position model")
          }
        }
        else if (amputated === 2) {
          //RIGHT LEG\\
          try {
            RightLegPredict(detect)
            //console.log("Predict X", answer[0], "Predict Y", answer[1])
            

          } catch (error) {
            //console.log("Could not determine hip position model")
          }
        }

        else if (amputated === 1)
        {
          try {
            LeftLegPredict(detect);
            //console.log("Predict X", answer[0], "Predict Y", answer[1])
            
    
          } catch (error) {
            //console.log("Could not determine hip position model")
          }
        }
      

     
    }
  };



  runBodysegment();

  return (
    <div className="App">
      <title>Prosthetic App</title>
      <div className="loginClass">
            <h1>Hello! What is amputated?</h1>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Button variant="contained" color="#12E4D5" onClick={leftLeg}>Left Leg</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="#12E4D5" onClick={rightLeg}>Right Leg</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="#12E4D5" onClick={leftArm}>Left Arm</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="#12E4D5" onClick={rightArm}>Right Arm</Button>
                </Grid>
            </Grid>
        </div>
      <header className="App-header">
        <div>
        <Webcam id="webcam" ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "left",
            zindex: 9,
            
            width: 640,
            height: 480,
          }}
        />
        <img src={arm} id="pro" className="prosthetic" display='none' height="1px" width="1px" alt="arm"></img>
        </div>
         <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "left",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      <img src={foot} id="bro" className="prosthetic" display='none' height="1px" width="1px" alt="leg"></img>
         <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "left",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>


    </div>
    
  );
}

export default App;
