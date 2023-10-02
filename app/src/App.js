import React from 'react'
import Home from './components/Home'
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ViewTransaction from './components/ViewTransaction'

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/:contract' element={<ViewTransaction/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
