import StartGame from './start_game';
import store from './store'
import { Provider } from 'react-redux'

export default function App() {
    return <Provider store={store}>
        <StartGame/>
    </Provider>
}
