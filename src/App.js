import './App.css';
import { Button, Alert, Table, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
function App() {
  const [showModal, setShowModal] = useState(false)



  const [myPlayer, setMyPlayer] = useState(null)
  const [myPlayerScore, setMyPlayerScore] = useState(100)
  const [myDice, setMyDice] = useState(0)
  const [attackAgainMyPlayer, setattackAgainMyPlayer] = useState(false)
  const [myWins, setMyWins] = useState(0)
  const [myLoses, setMyLoses] = useState(0)

  const [opponent, setOpponent] = useState(null)
  const [opponentScore, setopponentScore] = useState(100)
  const [opponentDice, setopponentDice] = useState(0)
  const [attackAgainMyOpponent, setattackAgainMyOpponent] = useState(false)
  const [opponentWins, setopponentWins] = useState(0)
  const [opponentLoses, setopponentLoses] = useState(0)

  const [message, setMessage] = useState('')

  const offset = useState(Math.floor(Math.random() * 1000));
  useEffect(() => {
    generateGame()
  }, [])

  const generateGame = async () => {
    axios.get(`https://pokeapi.co/api/v2/pokemon?limit=2&offset=${offset}`)
      .then((pokemons) => {
        generatePokemonData(pokemons.data.results[0]).then(res => setMyPlayer(res))
        generatePokemonData(pokemons.data.results[1]).then(res => setOpponent(res))

      })
  }

  const generatePokemonData = async (pokemon) => {
    let url = pokemon.url
    try {
      let response = await axios.get(url)
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  const Attack = () => {
    let tmpMyDice = Math.floor((Math.random() * 6) + 1)
    let tmpOpponentDice = Math.floor((Math.random() * 6) + 1)
    setMyDice(tmpMyDice)
    setopponentDice(tmpOpponentDice)

    if (tmpMyDice == 6)
      setattackAgainMyPlayer(true)
    else setattackAgainMyPlayer(false)

    if (tmpOpponentDice == 6)
      setattackAgainMyOpponent(true)
    else setattackAgainMyOpponent(false)


    if (tmpOpponentDice == 6 && tmpMyDice == 6) {
      setattackAgainMyPlayer(false)
      setattackAgainMyOpponent(false)
    }

    let tmpMyScore = myPlayerScore - tmpOpponentDice
    let tmpOpponentScore = opponentScore - tmpMyDice

    if (tmpMyScore <= 0) {
      setopponentWins(opponentWins + 1)
      setMyLoses(myLoses + 1)
      setMessage('Game Over')
      setShowModal(true)
      setMyPlayerScore(0)

    }
    else {
      setMyPlayerScore(myPlayerScore - tmpOpponentDice)
    }
    if (tmpOpponentScore <= 0) {
      setMyWins(myWins + 1)
      setopponentLoses(opponentLoses + 1)
      setShowModal(true)
      setMessage('You Win')
      setopponentScore(0)
    }
    else {
      setopponentScore(opponentScore - tmpMyDice)
    }

  }

  const AttackAgain = () => {
    if (attackAgainMyPlayer) {
      let tmpMyDice = Math.floor((Math.random() * 6) + 1)
      setMyDice(tmpMyDice)
      let tmpOpponentScore = opponentScore - tmpMyDice
      if (tmpOpponentScore <= 0) {
        setMyWins(myWins + 1)
        setopponentLoses(opponentLoses + 1)
        setMessage('You Win')
        setShowModal(true)
        setopponentScore(0)
      }
      else {
        setopponentScore(opponentScore - tmpMyDice)
      }
      setattackAgainMyPlayer(false)
    }
    if (attackAgainMyOpponent) {
      let tmpOpponentDice = Math.floor((Math.random() * 6) + 1)
      setopponentDice(tmpOpponentDice)
      let tmpMyScore = myPlayerScore - tmpOpponentDice
      if (tmpMyScore <= 0) {
        setopponentWins(opponentWins + 1)
        setMyLoses(myLoses + 1)
        setMessage('Game Over')
        setShowModal(true)
        setMyPlayerScore((0))
      }
      else {
        setMyPlayerScore(myPlayerScore - tmpOpponentDice)
      }
      setattackAgainMyOpponent(false)
    }
  }

  const resetValues = () => {
    setShowModal(false)
    setMyDice(0)
    setopponentDice(0)
    setMyPlayerScore(100)
    setopponentScore(100)
    setattackAgainMyOpponent(false)
    setattackAgainMyPlayer(false)
  }

  return (
    <div style={{ width: '40%', margin: '0 auto' }} className="App">
      <div className="border-1px solid white">
        <h3>Pokemon Battle Simulator</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h4>Player</h4>
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: `${myPlayerScore}%` }} aria-valuenow={myPlayerScore} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div>
              {`${myPlayerScore}/100`}
            </div>
            <img src={myPlayer?.sprites?.front_default} />
            <h6>{myPlayer?.name}</h6>
            {attackAgainMyPlayer &&
              <Button onClick={() => AttackAgain()} variant="primary">Attack</Button>}
          </div>

          <div>
            <div className='row justify-content-evenly'>
              <div style={{ width: 40, height: 40 }} className='border rounded col-2'>
                <h3>{myDice}</h3>
              </div>
              <div style={{ width: 40, height: 40 }} className='border rounded col-2'>
                <h3>{opponentDice}</h3>
              </div>
            </div>
            <h6 style={{ fontWeight: 'bold', marginTop: 20 }}>{`You attack with ${myDice}`}</h6>
            <h6 style={{ fontWeight: 'bold' }}>{`Opponent attack with ${opponentDice}`}</h6>
          </div>

          <div>
            <h4>Opponent</h4>

            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: `${opponentScore}%` }} aria-valuenow={opponentScore} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div>
              {`${opponentScore}/100`}
            </div>
            <img src={opponent?.sprites?.front_default} />
            <h6>{opponent?.name}</h6>
            {attackAgainMyOpponent &&
              <Button onClick={() => AttackAgain()} variant="primary">Attack</Button>}

          </div>
        </div>

        {(!attackAgainMyPlayer && !attackAgainMyOpponent) &&
          <Button onClick={() => Attack()} variant="primary">Attack</Button>}

      </div>
      <Modal show={showModal}>
        <Modal.Header>
          <Modal.Title style={{ margin: '0 auto' }}>{message}</Modal.Title>
        </Modal.Header>
        <Modal.Footer style={{ margin: '0 auto' }}>
          <Button variant="primary" onClick={() => { window.location.reload(true) }}>
            New Pokémon
          </Button>
          <Button variant="warning" onClick={() => resetValues()}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>

      <Table className='mt-2' bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Wins</th>
            <th>Loses</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>My Player</td>
            <td>{myWins}</td>
            <td>{myLoses}</td>

          </tr>
          <tr>
            <td>Opponent</td>
            <td>{opponentWins}</td>
            <td>{opponentLoses}</td>

          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default App;
