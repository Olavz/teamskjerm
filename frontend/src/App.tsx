import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FantIkkeSiden from "./sider/FantIkkeSiden.tsx";
import InfoskjermKontrollpanel from "./sider/InfoskjermKontrollpanel.tsx";

import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import AdministrerKontrollpanel from "./sider/AdministrerKontrollpanel.tsx";
import Startside from "./sider/Startside.tsx";



createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route index={true} element={<Startside/>}/>
                <Route path="/kontrollpanel/:kontrollpanelUUID" element={<InfoskjermKontrollpanel/>}/>
                <Route path="/administrer/kontrollpanel/:kontrollpanelUUID" element={<AdministrerKontrollpanel/>}/>

                <Route path="*" element={<FantIkkeSiden/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
