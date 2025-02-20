let recipes = [];
async function fetchRecipes() {
  try{
    const response = await fetch("recipes.json");
    const data = await response.json();
    recipes.push(data)
    return data;
  }catch(error){
    console.log('Error loading recipes :',error);
    return [];
  }
}
async function initializRecipes(){
  recipes = await fetchRecipes();
  displayrandomrecipes(recipes,12); 
}
initializRecipes();
setTimeout(() => {
  const cardBtn = document.querySelectorAll(".recipe-card");
  cardBtn.forEach((card) => {
    card.addEventListener("click",(event) => {
      recipePopup(event.currentTarget.id);
    });
  })
},800);

document.querySelector('.search-btn').addEventListener("click",searchRecipes);
document.querySelector('#search-box').addEventListener("keydown",(e) => {
  if(e.key =='Enter'){
    searchRecipes();
  }
});
function displayrandomrecipes(recipes,count) {
  const recipeGrid = document.getElementById('recipe-grid');
  recipeGrid.innerHTML = ""; // Clear previous recipes
  let randomRecipes = selectrandomrecipes(recipes,count);
  randomRecipes.forEach(item => {
  let recipeCard = createrecipeCard(item);
  recipeGrid.append(recipeCard);
  });
}

function selectrandomrecipes(recipes,count) {
  const shuffledRecipes = [...recipes].sort(() => 0.5 - Math.random());
  return shuffledRecipes.slice(0,count)
}
function createrecipeCard(recipes) {
  const card =document.createElement('div');
  card.classList.add('recipe-card');
  card.setAttribute("id",recipes.id);

  let img = document.createElement('img');
  img.src = recipes.image;
  img.alt = recipes.name;

  let title = document.createElement('h3')
  title.textContent = recipes.name;

  card.appendChild(img);
  card.appendChild(title);

  return card;
}
function recipePopup(id){
  const item = recipes.find((recipe) => recipe.id === parseInt(id));
  if(!item) return;
  let popupElement = document.querySelector(".popup");
  let popupContent = document.querySelector(".popup-content");

  let img = document.createElement('img');
  img.src = item.image;
  img.alt = item.name;

  let title = document.createElement('h2');
  title.textContent = item.name;

  let ingredientsList = document.createElement('p');
  ingredientsList.classList.add('ingrediants');
  item.ingredients.forEach(ingredient =>{
    const li = document.createElement("ul");
    li.textContent = ingredient;
    ingredientsList.appendChild(li);  
  });
  let instructions = document.createElement('p');
  instructions.classList.add('instructions');
  instructions.textContent = item.instructions;

  popupContent.innerHTML = `<span class="close">&times;</span>`;
  popupContent.appendChild(img);
  popupContent.appendChild(title);
  popupContent.appendChild(document.createElement('h4')).textContent = "Ingredients";
  popupContent.appendChild(ingredientsList);
  popupContent.appendChild(document.createElement('h4')).textContent = "Instructions";
  popupContent.appendChild(instructions);

  popupElement.style.display = "flex";

  document.querySelector(".close").addEventListener("click", () => {
    popupElement.style.display = "none";
  });
  popupElement.addEventListener("click", (event) => {
    if (event.target === popupElement) {
      popupElement.style.display = "none";
    }
  });
}

function searchRecipes() {
  let query = document.querySelector('#search-box').value.toLowerCase().trim();
  if (!query) {
    displayrandomrecipes(recipes,12);
    const cardBtn = document.querySelectorAll(".recipe-card");
    cardBtn.forEach((card) => {
      card.addEventListener("click",(event) => {
        recipePopup(event.currentTarget.id);
      });
    });
    return
  };
  let results = recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(query) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(query))
  );
  displayRecipes(results); // Function to update the UI with filtered results
}
function displayRecipes(recipe) {
  const recipeGrid = document.getElementById('recipe-grid');
  recipeGrid.innerHTML = "";
  recipe.forEach((item) =>{
    let recipeCard = createrecipeCard(item);
    recipeGrid.append(recipeCard);
    recipeCard.addEventListener("click",() => {
      recipePopup(recipeCard.id);
    })
});
}