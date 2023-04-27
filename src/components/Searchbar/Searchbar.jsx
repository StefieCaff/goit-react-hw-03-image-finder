import { func } from "prop-types";
import { useState } from "react";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const Searchbar = ({ onSubmit}) => {
    
    const [query, setQuery] = useState('');
    
    const handlerChange = e => {
        const userInput = e.currentTarget.value.toLowerCase().trim()
        setQuery(userInput);

        console.log(query);
    };

    const handlerSubmit = e => {
        e.preventDefault();

        if (query === "") {
            Notify.info('Please enter a search query');
            return;
        }
        
        onSubmit(query);
        setQuery('');
    }
    
    return (
        <header className="Searchbar">
            <form className="SearchForm" onSubmit={handlerSubmit}>
                <button type="submit" className="SearchForm-button">
                    <span className="SearchForm-button-label">Search</span>
                </button>
                <label className="SearchForm-button-label" htmlFor="text-search"></label>
                    <input
                        name="text-search"
                        className="SearchForm-input"
                        type="text"
                        autoComplete="off"
                        autoFocus
                        placeholder="Search images and photos"
                        onChange = {handlerChange}
                    />
            </form>
        </header>

    )
};


Searchbar.propTypes = {
    onSubmit: func.isRequired,
};

export { Searchbar };