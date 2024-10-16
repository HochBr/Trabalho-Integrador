import React from 'react';
import './componentes/TelaGeral/telageral.css'; 
import Login from './componentes/TelaGeral/Login';

function App() {
  return (
    <div className="container-xxl">
      <div className='row'>
        <div className='col-12'>
          <Login/>
        </div>

      </div>
    </div>
  );
}

export default App;
