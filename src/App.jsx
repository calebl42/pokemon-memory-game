import { useState, useEffect } from 'react'
import './App.css'

let pokeInit = false
let UUID = 0
function genId() {
  return UUID++
}

function Header({ getPokemon, setNumPokemon }) {
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

function Board({ pokemon, numPokemon, cardStates, setCardStates }) {
  function flipPokemon(pokeId) {
    if (cardStates[pokeId].faceup && cardStates[pokeId].visible) return
    let numRev = cardStates.filter((card) => card.visible && card.faceup).length
    if (numRev === 2) {
      let newCardStates = structuredClone(cardStates)
      let faceups = []
      for (let i = 0; i < cardStates.length; i++) {
        if (cardStates[i].visible && cardStates[i].faceup) faceups.push(i)
      }

      let faceupNames = pokemon.filter((poke) => faceups.includes(poke.id)).map((poke) => poke.name)
      if (faceupNames[0] === faceupNames[1]) {
        newCardStates[faceups[0]].visible = false
        newCardStates[faceups[1]].visible = false
      } else {
        newCardStates[faceups[0]].faceup = false
        newCardStates[faceups[1]].faceup = false
      }
      newCardStates[pokeId].faceup = true
      setCardStates(newCardStates)
    } else {
      let newCardStates = cardStates.map((card, index) => {
        return { ...card, faceup: index === pokeId ? true : card.faceup }
      }) 
      let visibleCards = []
      for (let i = 0; i < cardStates.length; i++) {
        if (cardStates[i].visible) visibleCards.push(i)
      }

      if (visibleCards.length === 2 && 
        (cardStates[visibleCards[0]].faceup || cardStates[visibleCards[1]].faceup )) {
        newCardStates[visibleCards[0]].visible = false
        newCardStates[visibleCards[1]].visible = false
      }
      setCardStates(newCardStates)
    }
  }

  return (
    <main>
      {pokemon.map((poke) => {
        return <div 
          key={poke.id} 
          className={'pokemon-card ' + (cardStates[poke.id].faceup ? 'faceup ' : 'facedown ') + (cardStates[poke.id].visible ? 'visible ' : 'hidden ')} 
          onClick={() => flipPokemon(poke.id)}
          >
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
  const [ numPokemon, setNumPokemon ] = useState(6)
  const [ pokemon, setPokemon ] = useState([])
  const [ cardStates, setCardStates ] = useState(new Array(12).fill({faceup: false, visible: true}))

  useEffect(() => {
    if (!pokeInit) {
      pokeInit = true
      getPokemon()
    }
  }, [])

  async function getPokemon(pokeCount = numPokemon) {
    let nextPokemon = new Array(pokeCount*2)
    UUID = 0
    setCardStates(new Array(numPokemon*2).fill({faceup: false, visible: true}))
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
    }
  }

  return (
    <>
      <Header getPokemon={getPokemon} setNumPokemon={setNumPokemon} />
      <Board pokemon={pokemon} numPokemon={numPokemon} cardStates={cardStates} setCardStates={setCardStates} />
      <Footer />
    </>
  )
}

export default App
