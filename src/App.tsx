import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import FirstView from './pages/FirstView';
import { SecondView } from './pages/SecondView';

export default function App() {
    return (
        <Routes>
            <Route path="/*" element={
                <Dashboard>
                    <Routes>
                        <Route path="/" element={<FirstView />} />
                        <Route path="/first_view" element={<FirstView/>}/>
                        <Route path="/second_view" element={<SecondView/>}/>
                    </Routes>
                </Dashboard>
            } />
        </Routes>
    );
};

