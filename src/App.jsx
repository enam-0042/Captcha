import { useState } from 'react'
import Captcha from './components/Captcha'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Captcha/>
    </>
  )
}

export default App
