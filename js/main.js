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

    menu.render();
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


const shoppingList = {
  list: '',
  render: function() {
    this.cacheDom();
    this.ol.innerHTML =''
    this.list.forEach(item => {
      this.cacheDom();
      this.buildList(item);
    });
  },
  mapItems: function() {
    this.list = addMeal.weeklyMeals.filter(item => item.haveEverything === 'false')
    .flatMap(item => item.ingredients)
    console.log(this.list, addMeal.weeklyMeals)
    this.render();
  },
  buildList: function(item) {
    this.li.innerHTML = item;
    this.ol.appendChild(this.li);
  },
  cacheDom: function() {
    this.ol = document.getElementById("shopping-list");
    this.li = document.createElement("li");
  },
  init: function() {
    this.cacheDom();
    this.mapItems();
  }
};

const menu = {
  weeklyMeals: addMeal.weeklyMeals,
  render: function() {
      this.cacheDom();
      this.tb.innerHTML = ''
      shoppingList.init();
    this.weeklyMeals.forEach(meal => {
      this.cacheDom();
      this.buildTable(meal);
    });
  },
  buildTable: function(meal) {
    this.editBtn.setAttribute("data-toggle", "modal");
    this.editBtn.setAttribute("data-target", "#exampleModal");
    this.th.setAttribute("scope", "row");
    this.th.innerHTML = " ";
    this.td1.innerHTML = meal.name;
    this.td2.innerHTML = meal.ingredients.length;

    this.iTagReady.setAttribute("class","far fa-check-circle " + this.ready(meal.haveEverything) );
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
    const i = this.weeklyMeals.findIndex(weeklymeal => weeklymeal.id === meal.id)
    this.weeklyMeals.splice(i, 1)
    console.log("are we here", meal);
    menu.render()
  },
  bindEvents: function() {
    this.editSubmit.onclick = e => {
      e.preventDefault();
      this.editMeal(this.id);
    };
  }
};
item.init();

const mealIdeas = {
  init() {
    this.cacheDom();
    this.getMeals();
  },
  meals: [],
  getMeals() {
    fetch("https://recipe-puppy.p.rapidapi.com/", {
  "method": "GET",
  "headers": {
    "x-rapidapi-host": "recipe-puppy.p.rapidapi.com",
    "x-rapidapi-key": "2d63133bdcmsh685abfe378af147p1cd61djsn4c12fd46890f"
  }
})
.then(response => {
  return response.json();
}).then(data => {
  this.meals = data.results
  this.render()
}).catch(err => {
  console.log(err);
});

  },
   cacheDom: function() {
    this.div = document.getElementById("mealIdeas");
    this.ul = document.createElement("ul");
    this.li = document.createElement("li");

  },
  render: function() {
    this.meals.forEach(meal => {
      this.cacheDom();
      this.buildTable(meal);
    });
  },
  buildTable: function(meal) {
    this.li.innerHTML = meal.title;
    this.ul.appendChild(this.li);
    this.div.appendChild(this.ul)
  }

}

mealIdeas.init()

const obby = {
  name: "adia",
  age: 35,
  kids: true
}


function isString(ob) {

  for(let key in ob){
    if(typeof(ob[key]) === 'string'){
    console.log( ob[key])
  }

}
}

isString(obby)





















