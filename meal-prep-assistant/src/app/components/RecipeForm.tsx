import { useState } from 'react';
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

export default function RecipeForm() {
  const [recipe, setRecipe] = useState<Recipe>({
    title: '',
    ingredients: [{ name: '', quantity: '' }],
    instructions: '',
    cookTime: 0,
    category: 'breakfast',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIngredientChange = (
    index: number,
    key: keyof Ingredient,
    value: string,
  ) => {
    const updatedIngredients = [...recipe.ingredients]; // Copy the ingredients array
    updatedIngredients[index] = { ...updatedIngredients[index], [key]: value }; // Modify one ingredient
    setRecipe({ ...recipe, ingredients: updatedIngredients }); // Update state
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post('http://localhost:4000/api/recipes', recipe)
      .then((response) => {
        console.log('Recipe saved:', response.data);
        setRecipe(response.data);
      })
      .catch((error) => {
        console.error('Error saving recipe:', error);
        setError('An error occurred while saving the recipe.Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form
      className="flex flex-col space-y-4 mt-6"
      key={recipe._id || 'new'}
      onSubmit={handleSubmit}
    >
      <label>
        <span className="block font-semibold">Recipe Title</span>
        <input
          name="title"
          type="text"
          placeholder="Recipe title"
          className="border p-2 rounded-lg text-black"
          value={recipe.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
        />
      </label>
      <label>
        <span className="block font-semibold">Cook Time (minutes)</span>
        <input
          name="cookTime"
          type="number"
          placeholder="Cook time in minutes"
          className="border p-2 rounded-lg text-black"
          value={recipe.cookTime}
          onChange={(e) =>
            setRecipe({ ...recipe, cookTime: parseInt(e.target.value) })
          }
        />
      </label>
      {recipe.ingredients.map((ingredient, index) => (
        <div key={index} className="flex space-x-4">
          <input
            type="text"
            className="border p-2 rounded-lg w-1/2"
            placeholder="Quantity"
            value={ingredient.quantity}
            onChange={(e) =>
              handleIngredientChange(index, 'quantity', e.target.value)
            }
          />
          <input
            type="text"
            className="border p-2 rounded-lg w-1/2"
            placeholder="Ingredient"
            value={ingredient.name}
            onChange={(e) =>
              handleIngredientChange(index, 'name', e.target.value)
            }
          />
        </div>
      ))}
      <button
        type="button"
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() =>
          setRecipe({
            ...recipe,
            ingredients: [...recipe.ingredients, { name: '', quantity: '' }],
          })
        }
      >
        Add Ingredient
      </button>
      <label>
        <span className="block font-semibold">Category</span>
        <select
          name="category"
          className="border p-2 rounded-lg text-black"
          onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </label>
      <div className="flex flex-col space-y-4 text-black">
        <label>
          <span className="block font-semibold">Instructions</span>
          <input
            name="instructions"
            type="text"
            placeholder="Instructions"
            className="border p-2 rounded-lg text-black"
            onChange={(e) =>
              setRecipe({ ...recipe, instructions: e.target.value })
            }
          />
        </label>
      </div>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
