import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { user: currentUser, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <img src="/uteq-azul.png" width="100" height="70" alt="Logo" className="rounded-4 me-3" />
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"aria-controls="navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" href="users">Usuarios</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <button className="nav-link dropdown-toggle text-white btn btn-link" onClick={() => setShowDropdown(!showDropdown)} aria-expanded={showDropdown}>
                                {currentUser?.name}
                            </button>
                            <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                                <li><span className="dropdown-item">{currentUser?.name} {currentUser?.lastname1}</span></li>
                                <li><span className="dropdown-item">{currentUser?.email}</span></li>
                                <li><span className="dropdown-item">{currentUser?.type}</span></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); logout(); }}>CERRAR SESIÓN</button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}