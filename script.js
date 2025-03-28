/*
Mapping from MealDB Categories to TheCocktailDB drink ingredient
You can customize or expand this object to suit your needs.
*/
const mealCategoryToCocktailIngredient = {
  Beef: "whiskey",
  Chicken: "gin",
  Dessert: "amaretto",
  Lamb: "vodka",
  Miscellaneous: "vodka",
  Pasta: "tequila",
  Pork: "tequila",
  Seafood: "rum",
  Side: "brandy",
  Starter: "rum",
  Vegetarian: "gin",
  Breakfast: "vodka",
  Goat: "whiskey",
  Vegan: "rum",
  // Add more if needed; otherwise default to something like 'cola'
};

/*
    2) Main Initialization Function
       Called on page load to start all the requests:
       - Fetch random meal
       - Display meal
       - Map meal category to spirit
       - Fetch matching (or random) cocktail
       - Display cocktail
*/
function lastmatprogram() {
  fetchRandomMeal()
    .then((meal) => { 
      displayMealData(meal);
      const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
      return fetchDrikkeMedIngrediens(spirit);
        })
    .then((cocktail) => {
      displayCocktailData(cocktail);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/*
 Fetch a Random Meal from TheMealDB
 Returns a Promise that resolves with the meal object
 */

function fetchRandomMeal() {
    return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then(response => {
        if (!response.ok) {
          throw new Error("Kunne ikke hente måltid");
        }
        return response.json();
    })
    .then(data => {
      console.log(data);
        return data.meals[0];
    })
    .catch(error => {
      throw error;
    });
}

/*
Display Meal Data in the DOM
Receives a meal object with fields like:
  strMeal, strMealThumb, strCategory, strInstructions,
  strIngredientX, strMeasureX, etc.
*/

function displayMealData(meal) {
  const mealContainer = document.getElementById("meal-container");

  const ingredientsList = getIngredientsList(meal);

  const mealHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}"/>
    <p>Category: ${meal.strCategory}</p>
    <p>Area: ${meal.strArea}</p>
    <h3>Ingredients</h3>
     <ul>
      ${ingredientsList}
    </ul>
    <h3>Instructions</h3>
    <p>${meal.strInstructions}</p>
  `;

  mealContainer.innerHTML = mealHTML;
}

function getIngredientsList(meal) {
  let ingredientsHTML = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient !== "" && measure && measure !== "") {
      ingredientsHTML += `<li>${ingredient} - ${measure}</li>`;
    }
  }
  return ingredientsHTML;
}


/* DEL 4 */
/* Fetch drikke med ingrediens-søk */
function fetchDrikkeMedIngrediens(drikkeIngrediens) {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(drikkeIngrediens)}`;
    return fetch (url)
    .then (response => response.json())
    .then (data => {
      if (data.drinks && data.drinks.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.drinks.length);
        return data.drinks[randomIndex];
      } else {
        return fetchTilfeldigDrikke(); 
      }
    });
}

/* Fetch tilfeldig drikke hvis søk feiler */
function fetchTilfeldigDrikke() {
    return fetch ("https://www.thecocktaildb.com/api/json/v1/1/random.php")
    .then (response => response.json())
    .then(data => data.drinks[0]);
}

/* Vis drikkeinfo i DOM - Document Object Model */
function visDrikkeinfo(drikke) {
  const container = document.getElementById("drikke-container");

  let ingredienserHTML = "<ul>";
  for (let i = 1; i <= 15; i++) {
    const ingr = drikke[`strIngredient${i}`]; //API
    const mengde = drikke[`strMeasure${i}`];
    if (ingr && ingr.trim()) {
      ingredienserHTML += `<li>${ingr} - ${mengde || ""}</li>`;
    }
  }
  ingredienserHTML += "</ul>";

  container.innerHTML = `
    <h2>${drikke.strDrink}</h2>
    <img src="${drikke.strDrinkThumb}" alt="${drikke.strDrink}">
    <h3>Ingredienser:</h3>
    ${ingredienserHTML}
    <h3>Fremgangsmåte:</h3>
    <p>${drikke.strInstructions}</p>
  `;
}

/* Kjør funksjonen lastmatprogram() når siden laster */
window.onload = lastmatprogram;