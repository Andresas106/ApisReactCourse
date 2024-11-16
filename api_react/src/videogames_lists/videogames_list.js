import React, { useState, useEffect } from 'react';
import VideogameCard from '../videogame_card/videogame_card';


function Videogames()
{
    const [videogames, setVideogames] = useState([]); //useState por the state
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        fetchGames();
    }, []); // [] make sure that only one time is executed when the component is charged

    const fetchGames = (query = "") => {
        const url = query ? 'https://api.rawg.io/api/games?key=7ea9457a112040cc9e36b4e1ef3c6d7e&search=' + query 
        : 'https://api.rawg.io/api/games?key=7ea9457a112040cc9e36b4e1ef3c6d7e';

        fetch(url)
        .then((response) => response.json())
        .then((json) => {
            setVideogames(json.results);
        })
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchKeyword(query);
        fetchGames(query);
    }

    return (
        <div className='container'>
             <input className='search-input'
                type="text"
                placeholder="Search videogames..."
                value={searchKeyword}
                onChange={handleSearch}
            />
            <div>
                <ul className='videogames-list'>
                {videogames.map((videogame) => (
                    <VideogameCard key={videogame.id} id={videogame.id} name={videogame.name} 
                    background_image={videogame.background_image} rating={videogame.rating} released={videogame.released}/>
                ))}
                </ul>
            </div>
        </div>
            
    );
}

export default Videogames;