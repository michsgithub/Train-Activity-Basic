
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAuK-TwXCPcX_6bjEc8aKN6MXFuMOxXVyk",
  authDomain: "trainactivitybasic-bf0f5.firebaseapp.com",
  databaseURL: "https://trainactivitybasic-bf0f5.firebaseio.com",
  projectId: "trainactivitybasic-bf0f5",
  storageBucket: "trainactivitybasic-bf0f5.appspot.com",
  messagingSenderId: "835990217926"
  };

firebase.initializeApp(config);
var dataRef = firebase.database();
// Initial Values
var trainName = "";
var destination = "";
var frequency = "";
var firstTrainTime = 0;
var nextArrival = "";
var minutesAway = "";
var firstTimeConverted = 0;
var currentTime = 0;
var diffTime = 0;
var tRemainder = 0;
var tMinutesTillTrain = 0;
var nextTrain = 0;

// Capture Button Click
$("#add-train").on("click", function(event) {
  event.preventDefault();
  trainName = $("#train-name-input").val().trim();
  destination = $("#destination-input").val().trim();
  firstTrainTime = $("#first-train-time-input").val().trim();
  frequency = $("#frequency-input").val().trim();
  firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  console.log("first train time converted: " + firstTimeConverted);
  currentTime = moment();
  diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("diff time: " + diffTime);
  tRemainder = diffTime % frequency;
  console.log("time remainder: " + tRemainder);
  tMinutesTillTrain = frequency - tRemainder;
  console.log("time until next train: " + tMinutesTillTrain);
  nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Code for the push
  dataRef.ref().push({
    trainName: trainName,
    destination: destination,
    frequency: frequency,
    nextTrain: nextTrain.toLocaleString(),
    tMinutesTillTrain: tMinutesTillTrain,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

// Firebase watcher + initial loader HINT: .on("value")
dataRef.ref().on("child_added", function(snapshot) {
  // Log everything that's coming out of snapshot
  console.log(snapshot.val());
  console.log(snapshot.val().trainName);
  console.log(snapshot.val().destination);
  console.log(snapshot.val().frequency);
  console.log(snapshot.val().tMinutesTillTrain);
  console.log(snapshot.val().nextTrain);
  // Change the HTML to reflect
  $("#trainTableId").append("<tr><td>" + snapshot.val().trainName+ "</td>" + "<td>" + snapshot.val().destination + "</td>" + "<td>" + snapshot.val().frequency + "<td>" + snapshot.val().nextTrain + "</td>" + "<td>" + snapshot.val().tMinutesTillTrain + "</td>" + "</td></tr>");

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

  //remove first line in the activity schedule
  var remove = document.getElementById("delete-train");
    remove.addEventListener("click", function(event){
      event.preventDefault();
      dataRef.ref().child("trainName[0]").remove();
      dataRef.ref().child("destination[0]").remove();
      dataRef.ref().child("frequency[0]").remove();
      dataRef.ref().child("nextTrain[0]").remove();
      dataRef.ref().child("tMinutesTillTrain[0]").remove();
      
    });
    


