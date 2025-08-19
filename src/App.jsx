import { useState } from 'react'
import './App.css'

let UUID = 0;
function Header({ setPokemon, boardLen }) {
  async function getPokemon() {
    setPokemon([])
    try {
      for (let i = 0; i < boardLen/2; i++) {
        let pokeNumber = Math.floor(Math.random() * 1026)
        let response = await fetch('https://pokeapi.co/api/v2/pokemon/' + pokeNumber)
        let responseData = await response.json()
        let curPokemon = { 
          id: UUID++,
          name: responseData['name'], 
          sprite: responseData['sprites']['other']['official-artwork']['front_default']
        }
        let dupPokemon = {
          id: UUID++,
          name: responseData['name'], 
          sprite: responseData['sprites']['other']['official-artwork']['front_default']
        }
        setPokemon(prevPokemon => [...prevPokemon, curPokemon, dupPokemon])
      }
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <header>
      <h1>Pokémon Memory Cards</h1>
      <div id='menu-buttons'>
        <button onClick={getPokemon}>new game</button>
        <button>set board size</button>
      </div>
    </header>
  )
}

function Board({ pokemon }) {
  return (
    <main>
      {pokemon.map((poke) => {
        return <div key={poke.id} className='pokemon-card'>
          <img src={poke.sprite} />
          <h1>{poke.name}</h1>
        </div>
      })}
    </main>
  )
}

function Footer() {
  return (
    <footer>
      <h3>
        2025 Caleb Lee
      </h3>
      <p>Made with <a href='https://pokeapi.co/'>PokéApi</a></p>
    </footer>
  )
}

function App() {
  const [ boardLen, setBoardLen ] = useState(10);
  const [ pokemon, setPokemon ] = useState([]);

  return (
    <div id='app'>
      <Header setPokemon={setPokemon} boardLen={boardLen} />
      <Board pokemon={pokemon} />
      <Footer />
    </div>
  )
}

export default App
