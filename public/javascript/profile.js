const token = sessionStorage.Bearer;

$.ajax({
  type: "GET",
  url: "/api/protected",
  dataType: "json",
  headers: {
    Authorization: `Bearer ${token}`
  },
  success: function(data) {
    $(".float-name").html("Hi " + data.username);
  },
  error: function(request, error) {
    console.log("Request: " + JSON.stringify(request));
    $(location).attr("href", "./index.html");
  }
});

$(".logout-btn").on("click", e => {
  sessionStorage.removeItem("Bearer");
  $(location).attr("href", "./index.html");
});
//GET ALL ROUTINES
function getRoutines() {
  const targetMuscle = $(".target-muscle").val();
  const workout = $(".workout").val();
  const reps = $(".reps").val();
  const sets = $(".sets").val();
  const author = $(".author").val();

  $.ajax({
    type: "GET",
    url: "/api/routines",
    data: {
      targetMuscle,
      workout,
      reps,
      sets,
      author
    },
    dataType: "json",
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function(data) {
      for (let i = 0; i < data.length; i++) {
        $(".routine-results").append(`<div data-routine-id="${
          data[i]._id
        }" class="routine-click">
                                        <p class="routine-category">Muscle Group</p>
                                        <li><a href="${data[i].targetMuscle}">${
          data[i].targetMuscle
        }</a></li>
                                        <p class="routine-category">Workout</p>
                                        <li><a href="${data[i].workout}">${
          data[i].workout
        }</a></li>
                                        <p class="routine-category">Repetitions</p>
                                        <li><a href="${data[i].reps}">${
          data[i].reps
        }</a></li>
                                        <p class="routine-category">Sets</p>
                                        <li><a href="${data[i].sets}">${
          data[i].sets
        }</a></li>
                                        <button data-routine-id="${
                                          data[i]._id
                                        }" class="delete-item">Delete</button>
                                    </div>`);
      }
    },
    error: function(request, error) {
      console.log("Request: " + JSON.stringify(request));
    }
  });
}

//POST A ROUTINE
function routinePost() {
  $(".routine-catch").on("submit", e => {
    e.preventDefault();

    const targetMuscle = $(".target-muscle").val();
    const workout = $(".workout").val();
    const reps = $(".reps").val();
    const sets = $(".sets").val();
    const author = $(".author").val();
    $.ajax({
      type: "POST",
      url: "/api/routines",
      data: {
        targetMuscle: targetMuscle,
        workout: workout,
        reps: reps,
        sets: sets,
        author: author
      },
      dataType: "json",
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: response => {
        if (response) {
          $(".result-message").html(
            '<p class="routine-creation">You just created a workout routine!</p>'
          );
          $(".target-muscle").val("");
          $(".workout").val("");
          $(".reps").val("");
          $(".sets").val("");
          $(".author").val("");
          $(".routine-results").html(`<div data-routine-id="${
            response._id
          }" class="routine-click">
                                        <p class="routine-category">Muscle Group</p>
                                        <li><a href="${
                                          response.targetMuscle
                                        }">${response.targetMuscle}</a></li>
                                        <p class="routine-category">Workout</p>
                                        <li><a href="${response.workout}">${
            response.workout
          }</a></li>
                                        <p class="routine-category">Repetitions</p>
                                        <li><a href="${response.reps}">${
            response.reps
          }</a></li>
                                        <p class="routine-category">Sets</p>
                                        <li><a href="${response.sets}">${
            response.sets
          }</a></li>
                                        <button data-routine-id="${
                                          response._id
                                        }" class="delete-item">Delete</button>
                                    </div>`);
        }
      },
      error: err => {
        console.log("Post: " + JSON.stringify(err));
      }
    });
  });
}

//DELETE A ROUTINE

function deleteRoutine() {
  $(".routine-results").on("click", e => {
    $target = $(e.target);
    const id = $target.attr("data-routine-id");
    $.ajax({
      type: "DELETE",
      url: "/api/routines/" + id,
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: response => {
        window.location.href = "/saved-routine.html";
      },
      error: error => {
        console.log(error);
      }
    });
  });
}

function updateRoutine() {}

//AJAX FOR DIETS

// GET ALL DIETS
function getDiets() {
  const title = $(".diet-title").val();
  const calories = $(".calories").val();
  const recipe = $(".recipe").val();
  const notes = $(".notes").val();
  const author = $(".author").val();

  $.ajax({
    type: "GET",
    url: "/api/diets",
    data: {
      title,
      calories,
      recipe,
      notes,
      author
    },
    dataType: "json",
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function(data) {
      for (let i = 0; i < data.length; i++) {
        $(".diet-results").append(`<div data-diet-id="${
          data[i]._id
        }" class="diet-click"> 
                                      <p class="diet-category">Diet</p>
                                      <li><a href="${data[i].title}">${
          data[i].title
        }</a></li>
                                      <p class="diet-category">Calories</p>
                                      <li><a href="${data[i].calories}">${
          data[i].calories
        }</a></li>
                                      <p class="diet-category">Recipe</p>
                                      <li><a href="${data[i].recipe}">${
          data[i].recipe
        }</a></li>
                                      <p class="diet-category">Notes</p>
                                      <li><a href="${data[i].notes}">${
          data[i].notes
        }</a></li>
                                      <button data-diet-id="${
                                        data[i]._id
                                      }" class="delete-item">Delete</button>
                                      </div>`);
      }
    },
    error: function(request, error) {
      console.log("Request: " + JSON.stringify(request));
    }
  });
}

//POST A DIET
function dietsPost() {
  $(".diet-catch").on("submit", e => {
    e.preventDefault();

    const title = $(".diet-title").val();
    const calories = $(".calories").val();
    const recipe = $(".recipe").val();
    const notes = $(".notes").val();
    const author = $(".author").val();
    $.ajax({
      type: "POST",
      url: "/api/diets",
      data: {
        title: title,
        calories: calories,
        recipe: recipe,
        notes: notes,
        author: author
      },
      dataType: "json",
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: response => {
        if (response) {
          $(".diet-message").html(
            '<p class="diet-creation">You just created a Diet!</p>'
          );
          $(".diet-title").val("");
          $(".calories").val("");
          $(".recipe").val("");
          $(".notes").val("");
          $(".author").val("");
          $(".diet-results").append(`<div data-diet-id="${
            response._id
          }" class="diet-click"> 
                                        <p class="diet-category">Diet</p>
                                        <li><a href="${response.title}">${
            response.title
          }</a></li>
                                        <p class="diet-category">Calories</p>
                                        <li><a href="${response.calories}">${
            response.calories
          }</a></li>
                                        <p class="diet-category">Recipe</p>
                                        <li><a href="${response.recipe}">${
            response.recipe
          }</a></li>
                                        <p class="diet-category">Notes</p>
                                        <li><a href="${response.notes}">${
            response.notes
          }</a></li>
                                        <button data-diet-id="${
                                          response._id
                                        }" class="delete-item">Delete</button>
                                        </div>`);
        }
      },
      error: err => {
        console.log("Post: " + JSON.stringify(err));
      }
    });
  });
}

//DELETE A DIET

function deleteDiet() {
  $(".diet-results").on("click", e => {
    $target = $(e.target);
    const id = $target.attr("data-diet-id");
    $.ajax({
      type: "DELETE",
      url: "/api/diets/" + id,
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: response => {
        window.location.href = "/saved-diet.html";
      },
      error: error => {
        console.log(error);
      }
    });
  });
}

$(function() {
  getRoutines();
  routinePost();
  getDiets();
  dietsPost();
  deleteDiet();
  deleteRoutine();
});
