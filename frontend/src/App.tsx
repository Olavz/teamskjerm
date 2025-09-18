import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FantIkkeSiden from "./sider/FantIkkeSiden.tsx";
import InfoskjermKontrollpanel from "./sider/InfoskjermKontrollpanel.tsx";

import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import AdministrerKontrollpanel from "./sider/administrerkontrollpanel/AdministrerKontrollpanel.tsx";
import Logginnside from "./sider/Logginn.tsx";
import Registreringsside from "./sider/Registrer.tsx";
import MineKontrollpanel from "./sider/MineKontrollpanel.tsx";
import Loggutside from "./sider/Loggut.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";

// Add this at the top of your App.tsx or in a separate utility file
// @ts-ignore
window.onerror = (message, source, lineno, colno, error) => {
    alert(`Error: ${error?.message || message}`);
    return false;
}

// For unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    alert(`Promise error: ${event.reason}`);
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <Routes>
                    <Route index={true} element={<MineKontrollpanel/>}/>
                    <Route path="/kontrollpanel" element={<MineKontrollpanel/>}/>
                    <Route path="/kontrollpanel/:kontrollpanelUUID" element={<InfoskjermKontrollpanel/>}/>
                    <Route path="/administrer/kontrollpanel/:kontrollpanelUUID" element={<AdministrerKontrollpanel/>}/>
                    <Route path="/logginn" element={<Logginnside/>}/>
                    <Route path="/loggut" element={<Loggutside/>}/>
                    <Route path="/registrer" element={<Registreringsside/>}/>

                    <Route path="*" element={<FantIkkeSiden/>}/>
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    </StrictMode>,
)
