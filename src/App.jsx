import { useState } from 'react'
import './App.css'

let UUID = 0;
function genId() {
  return UUID++;
}

function Header({ setPokemon, numPokemon, setNumPokemon }) {
  async function getPokemon(pokeCount = numPokemon) {
    let nextPokemon = new Array(pokeCount*2)
    try {
      let indicesToFill = []
      for (let i = 0; i < pokeCount*2; i++) {
        indicesToFill.push(i)
      }
      for (let i = 0; i < pokeCount; i++) {
        let pokeNumber = Math.floor(Math.random() * 1026)
        let response = await fetch('https://pokeapi.co/api/v2/pokemon/' + pokeNumber)
        let responseData = await response.json()
        let curPokemon = { 
          id: genId(),
          name: responseData['name'], 
          sprite: responseData['sprites']['other']['official-artwork']['front_default']
        }
        let dupPokemon = {
          id: genId(), 
          name: responseData['name'], 
          sprite: responseData['sprites']['other']['official-artwork']['front_default']
        }

        let randIndex = Math.floor(Math.random()*indicesToFill.length)
        nextPokemon[indicesToFill[randIndex]] = curPokemon
        indicesToFill.splice(randIndex, 1)

        randIndex = Math.floor(Math.random()*indicesToFill.length)
        nextPokemon[indicesToFill[randIndex]] = dupPokemon
        indicesToFill.splice(randIndex, 1)
      }
      setPokemon(nextPokemon)
    } catch(e) {
      console.error(e)
    }
  }

  function handleBoard() {
    let newPokeCount = prompt('Enter new number of pokemon')
    setNumPokemon(newPokeCount)
    getPokemon(newPokeCount)
  }

  return (
    <header>
      <h1>Pokémon Memory Cards</h1>
      <div id='menu-buttons'>
        <button onClick={() => getPokemon()}>new game</button>
        <button onClick={() => handleBoard()}>set board size</button>
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
          <h2>{poke.name}</h2>
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
  const [ numPokemon, setNumPokemon ] = useState(5);
  const [ pokemon, setPokemon ] = useState(new Array(10));

  return (
    <div id='app'>
      <Header setPokemon={setPokemon} numPokemon={numPokemon} setNumPokemon={setNumPokemon} />
      <Board pokemon={pokemon} />
      <Footer />
    </div>
  )
}

export default App
