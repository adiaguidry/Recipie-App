// Create a db for weekly meal prep
const db = new Dexie("menuDataBase");
db.version(1).stores({
  menu: "id, name, ingredients, haveEverything"
});
// BulkAdd meals to db
const bulkAddMeal = (dbtable, data) => {
  //check that all fields are filled out
  dbtable.bulkAdd([data]);
};

const addMeal = {
  weeklyMeals: [],
  init: function() {
    this.cacheDom();
    this.bindEvents();
    console.log("lets go");
  },
  getMeal: function() {
    return {
      id: uuidv4(),
      name: this.name.value,
      ingredients: this.ingredients.value.replace(/\,/g, "").split(" "),
      haveEverything: this.haveEverything.value
    };
  },
  bindEvents: function() {
    this.btnAdd.onclick = e => {
      e.preventDefault();
      this.addMeal();
    };
  },
  addMeal: function() {
    this.weeklyMeals.push(this.getMeal());
    this.name.value = this.ingredients.value = "";
    this.haveEverything.value = "Choose...";

    menu.init();
    // bulkAddMeal(db.menu, this.getMeal())
  },
  cacheDom: function() {
    this.name = document.getElementById("name");
    this.ingredients = document.getElementById("ingredients");
    this.haveEverything = document.getElementById("have-everything");
    this.btnAdd = document.getElementById("btn-add-meal");
  }
};

addMeal.init();

const menu = {
  weeklyMeals: [
    {
      id: 1,
      name: "waffles",
      ingredients: ["flour", "sugar", "syrup", "butter"]
    },
    {
      id: 2,
      name: "soup",
      ingredients: ["flour", "sugar"]
    },
    {
      id: 3,
      name: "chicken yum yum",
      ingredients: ["flour", "sugar", "syrup", "butter"],
      haveEverything: "true"
    }
  ],
  render: function() {
    console.log(this.weeklyMeals);
    //this.tb.innerHTML = ''
    let num = 0;
    this.weeklyMeals.forEach(meal => {
      num++;
      console.log(num, meal);
      this.buildTable(meal);
    });
  },
  buildTable: function(meal) {
    this.editBtn.setAttribute("data-toggle", "modal");
    this.editBtn.setAttribute("data-target", "#exampleModal");
    this.th.setAttribute("scope", "row");
    this.th.innerHTML = meal.id;
    this.td1.innerHTML = meal.name;
    this.td2.innerHTML = meal.ingredients.length;

    this.iTagReady.setAttribute(
      "class",
      "far fa-check-circle " + this.ready(meal.haveEverything)
    );
    this.iTagEdit.setAttribute("class", "far fa-edit btnedit");
    this.iTagDelete.setAttribute("class", "far fa-trash-alt btnno");

    this.readyBtn.appendChild(this.iTagReady);
    this.deletebtn.appendChild(this.iTagDelete);
    this.editBtn.appendChild(this.iTagEdit);

    this.tr.appendChild(this.th);
    this.tr.appendChild(this.td1);
    this.tr.appendChild(this.td2);
    this.tr.appendChild(this.readyBtn);
    this.tr.appendChild(this.editBtn);
    this.tr.appendChild(this.deletebtn);

    this.tb.appendChild(this.tr);
    this.bindEvents(meal);
  },
  ready: function(haveEverything) {
    // if haveEverything btngo : btnno
    return haveEverything === "true" ? "btngo" : "btnno";
  },
  cacheDom: function() {
    this.tb = document.getElementById("table");
    this.tr = document.createElement("tr");
    this.th = document.createElement("th");
    this.td1 = document.createElement("td");
    this.td2 = document.createElement("td");
    this.readyBtn = document.createElement("td");
    this.editBtn = document.createElement("td");
    this.iTagEdit = document.createElement("i");
    this.iTagReady = document.createElement("i");
    this.deletebtn = document.createElement("td");
    this.iTagDelete = document.createElement("i");
  },
  bindEvents: function(meal) {
    this.editBtn.onclick = e => {
      e.preventDefault();
      item.recipie(meal);
    };
    this.deletebtn.onclick = e => {
      e.preventDefault();
      item.removeMeal(meal);
    };
  },
  init: function() {
    this.cacheDom();
    this.render();
  }
};

menu.init();

const item = {
  weeklyMeals: addMeal.weeklyMeals,
  id: "",
  name: "",
  ingredients: "",
  haveEverything: "",
  init() {
    this.cacheDom();
    this.bindEvents();
  },
  recipie(meal) {
    this.id = meal.id;
    this.name = this.weeklyMealName.value = meal.name;
    this.ingredients = this.weeklyMealIngredients.value = meal.ingredients;
    this.haveEverything = this.weeklyMealHaveEverything.value =
      meal.haveEverything;
  },
  cacheDom: function() {
    this.weeklyMealName = document.getElementById("edit-name");
    this.weeklyMealIngredients = document.getElementById("edit-ingredients");
    this.weeklyMealHaveEverything = document.getElementById(
      "edit-have-everything"
    );
    this.editSubmit = document.getElementById("edit-meal");
  },
  editMeal(id) {
    this.weeklyMeals.forEach((meal, index) => {
      if (meal.id === id) {
        //Edit meal object
        this.weeklyMeals[index].name = this.weeklyMealName.value;
        this.weeklyMeals[
          index
        ].ingredients = this.weeklyMealIngredients.value.split(",");
        this.weeklyMeals[
          index
        ].haveEverything = this.weeklyMealHaveEverything.value;
      }
    });
    menu.render();
  },
  removeMeal(meal) {
    // const i = this.weeklyMeals.findIndex(weeklymeal => weeklymeal.id === meal.id)
    // this.weeklyMeals.splice(i, 1)
    console.log("are we here", meal);
    // menu.render()
  },
  bindEvents: function() {
    this.editSubmit.onclick = e => {
      e.preventDefault();
      this.editMeal(this.id);
    };
  }
};
item.init();