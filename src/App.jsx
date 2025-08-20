import { useState, useEffect } from 'react'
import './App.css'

let pokeInit = false
let UUID = 0
function genId() {
  return UUID++
}

function Header({ score, bestScore,  getPokemon, setNumPokemon }) {
  async function handleBoard() {
    let newPokeCount = prompt('Enter new number of pokemon')
    if (!newPokeCount || newPokeCount === '0') newPokeCount = 6
    await getPokemon(newPokeCount)
    setNumPokemon(newPokeCount)
  }

  return (
    <header>
      <div id='title'>
        <img src='/src/assets/pokelogo.png' alt='pokemon-logo' />
        <h1>Memory Cards</h1>
      </div>
      <div id='menu-buttons'>
        <button onClick={async () => await getPokemon()}>new game</button>
        <button onClick={async () => await handleBoard()}>set Poké Count</button>
      </div>
      <div id='scoreboard'>
        <h3>Score: {score}</h3>
        <h3>Best score: {bestScore === Infinity ? 'None yet...' : bestScore}</h3>
      </div>
    </header>
  )
}

function Board({ score, setScore, bestScore, setBestScore, pokemon, cardStates, setCardStates }) {
  function flipPokemon(pokeId) {
    if (cardStates[pokeId].faceup && cardStates[pokeId].visible) return
    let activeCards = []
    for (let i = 0; i < cardStates.length; i++) {
      if (cardStates[i].visible && cardStates[i].faceup) activeCards.push(i)
    }

    let newCardStates = structuredClone(cardStates)
    if (activeCards.length === 0) {
      newCardStates[pokeId].faceup = true
    } else if (activeCards.length === 1) {
      activeCards.push(pokeId)
      let faceupNames = pokemon.filter((poke) => activeCards.includes(poke.id)).map((poke) => poke.name)
      newCardStates[activeCards[1]].faceup = true
      if (faceupNames[0] === faceupNames[1]) {
        newCardStates[activeCards[0]].visible = false
        newCardStates[activeCards[1]].visible = false
      } 
    } else if (activeCards.length === 2) {
      newCardStates[activeCards[0]].faceup = false
      newCardStates[activeCards[1]].faceup = false
      newCardStates[pokeId].faceup = true
    } 

    let visibleCards = []
    for (let i = 0; i < newCardStates.length; i++) if (newCardStates[i].visible) visibleCards.push(i)
      
    setCardStates(newCardStates)
    setScore(score+1)
    if (visibleCards.length === 0) setBestScore(Math.min(bestScore, score+1))
  }

  if (pokemon.length === 0) {
    return <main id='loading'>
      <img src='/src/assets/pika.jpg' alt='pikachu' />
      <h1>Loading Pokemon...</h1>
      <img src='/src/assets/pika.jpg' alt='pikachu' />
    </main>
  }

  return (
    <main>
      {pokemon.map((poke) => {
        return <div key={poke.id} 
          className={'pokemon-card ' + (cardStates[poke.id].faceup ? 'faceup ' : '')} 
          onClick={() => flipPokemon(poke.id)}>
          <div className={'card-front ' + (cardStates[poke.id].visible ? '' : 'hidden ')}>
            <img src={poke.sprite} />
            <h2>{poke.name}</h2>
          </div>
          <div className={'card-back '}> 
            <img src='/src/assets/bigpokeball.png' alt='big-pokeball'/>
          </div>
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
      <p>Made with Vite + React and <a href='https://pokeapi.co/'>PokéApi</a></p>
    </footer>
  )
}

function App() {
  const [ numPokemon, setNumPokemon ] = useState(6)
  const [ pokemon, setPokemon ] = useState([])
  const [ cardStates, setCardStates ] = useState(null)
  const [ score, setScore ] = useState(0)
  const [ bestScore, setBestScore ] = useState(Infinity)

  useEffect(() => {
    if (!pokeInit) {
      pokeInit = true
      getPokemon()
    }
  }, [])

  async function getPokemon(pokeCount = numPokemon) {
    let nextPokemon = new Array(pokeCount*2)
    UUID = 0
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
    } catch(e) {
      console.error(e)
    } finally {
      setPokemon(nextPokemon)
      setCardStates(Array.from(new Array(pokeCount*2), () => {return {faceup: false, visible: true}}))
      setScore(0)
    }
  }

  return (
    <>
      <Header score={score} bestScore={bestScore} getPokemon={getPokemon} setNumPokemon={setNumPokemon} />
      <Board score={score} setScore={setScore} bestScore={bestScore} setBestScore={setBestScore} pokemon={pokemon} cardStates={cardStates} setCardStates={setCardStates} />
      <Footer />
    </>
  )
}

export default App
