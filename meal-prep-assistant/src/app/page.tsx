'use client';
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import RecipeForm from './components/RecipeForm';
import axios from 'axios';

interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  _id?: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  cookTime: number;
  category: string;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/recipes')
      .then((response) => {
        console.log('Raw response:', response);
        setRecipes(response.data);
      })
      .catch((error) => console.error('Error fetching recipes:', error));
  }, []);

  const addNewRecipe = (newRecipe: Recipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Meal Prep Recipes</h1>
      <p className="text-center text-gray-600">
        Here are some recipes to help you get started with meal prepping.
      </p>
      <RecipeForm addNewRecipe={addNewRecipe} />
      <ul className="space-y-4">
        {recipes.map((recipe) => (
          <li key={recipe._id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{recipe.title}</h2>
            <p className="text-gray-600">
              <strong>Category:</strong> {recipe.category}
            </p>
            <p>
              <strong>Cook Time:</strong> {recipe.cookTime} minutes
            </p>
            <h3 className="mt-2 font-semibold">Ingredients:</h3>
            <ul className="list-disc ml-6">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.quantity} {ingredient.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
