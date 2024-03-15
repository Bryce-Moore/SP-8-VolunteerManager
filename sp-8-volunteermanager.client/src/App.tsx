import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import Dashboard from './page/Dashboard';
import RequireAuth from './service/RequireAuth';

function App() {
  return (
    <BrowserRouter> 
      <div> 
        <Routes>
          <Route path="/" element={<Home />} /> {/* Default route. Home screen */}
          <Route path="/dashboard" element={ 
            <RequireAuth> {/* Ensures there's an auth token in session storage. Redirects to Home if not*/}
              <Dashboard /> 
            </RequireAuth>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;