import StartGame from './start_game';
import store from './store'
import { Provider } from 'react-redux'
import GameStatus from './status';
import Image from 'next/image'

export default function App() {
    return <Provider store={store}>
        <div className='game-status'>
              <Image
                  src="/images/Uno_Logo.png" // Route of the image file
                  height={50} // Desired size with correct aspect ratio
                  width={50} // Desired size with correct aspect ratio
                  alt="Uno Logo"
              />
              <GameStatus/>
          </div>
        <StartGame/>
    </Provider>
}
