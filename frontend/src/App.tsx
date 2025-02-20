import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FantIkkeSiden from "./sider/FantIkkeSiden.tsx";
import InfoskjermKontrollpanel from "./sider/InfoskjermKontrollpanel.tsx";

import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import AdministrerKontrollpanel from "./sider/AdministrerKontrollpanel.tsx";
import Logginnside from "./sider/Logginn.tsx";
import Registreringsside from "./sider/Registrer.tsx";
import MineKontrollpanel from "./sider/MineKontrollpanel.tsx";
import Loggutside from "./sider/Loggut.tsx";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
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
    </StrictMode>,
)
