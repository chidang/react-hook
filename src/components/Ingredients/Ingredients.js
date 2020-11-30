import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest } = useHttp();
  
  // const [ userIngredients, setUserIngredients ] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filterIngredientsHandler = useCallback(filterIngredients => {
    // setUserIngredients(filterIngredients);
    dispatch({ type: 'SET', ingredients: filterIngredients })
  }, [])

  const addIngredientHandler = useCallback(ingredient => {
    // dispatchHttp({ type: 'SEND' });
    // fetch('https://react-hook-e5c58.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    // }).then(response => {
    //   dispatchHttp({ type: 'RESPONSE' });
    //   return response.json();
    // }).then((responseData) => {
    //   // setUserIngredients(prevIngredients => [
    //   //   ...prevIngredients, 
    //   //   {
    //   //     id: responseData.name, ...ingredient
    //   //   }
    //   // ]);
    //   dispatch({
    //     type: 'ADD',
    //     ingredient: { id: responseData.name, ...ingredient }
    //   })
    // }).catch(error => {
    //   dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong! ' + error.message });
    // });
  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(
      `https://react-hook-e5c58.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE'
    );
  }, [sendRequest]);

  const clearError = useCallback(() => {
    // dispatchHttp({ type: 'CLEAR' });
  },[]);

  const ingredientList = useMemo(() => {
    return <IngredientList
      ingredients={userIngredients}
      onRemoveItem={removeIngredientHandler}
    />
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      { error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
