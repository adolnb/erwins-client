import React, { useState, useEffect, useRef } from 'react';
import { usersRequest, deleteUserRequest } from '../../api/users';
import { useLocation } from 'react-router-dom';

export default function UsersView() {
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const modalRef = useRef(null);

    useEffect(() => {
        if (location.state?.message) {
            setMessage({
                text: location.state.message,
                type: location.state.type || 'success'
            });
            window.history.replaceState({}, '');
        }

        const fetchUsers = async () => {
            try {
                const response = await usersRequest();
                setUsers(response.data);
            } catch (error) {
                setMessage({ text: 'Error al cargar usuarios', type: 'danger' });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [location.state]);

    const handleShowDeleteModal = (userId) => {
        setSelectedUserId(userId);
        setShowDeleteModal(true);
        setDeleteError(null);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedUserId(null);
        setDeleteError(null);
    };

    const handleDeleteUser = async () => {
        if (!selectedUserId) return;
        
        setIsDeleting(true);
        try {
            await deleteUserRequest(selectedUserId);
            setUsers(users.filter(user => user._id !== selectedUserId));
            setMessage({ 
                text: 'Usuario eliminado correctamente', 
                type: 'success' 
            });
            handleCloseDeleteModal();
        } catch (error) {
            setDeleteError(error.response?.data?.msg || 'Error al eliminar usuario');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="container my-5">
                {message.text && (
                    <div className={`alert alert-${message.type} alert-dismissible fade show mt-3`} role="alert">
                        {message.text}
                        <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}aria-label="Close"></button>
                    </div>
                )}

                <h1 className="text-center mb-4">Catálogo de Usuarios</h1>
                <div className="d-flex justify-content-end mb-4">
                    <a href="add-user" className="btn btn-success">Añadir Usuario</a>
                </div>
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-sm table-hover table-bordered border-primary align-middle">
                            <thead className="table-dark">
                                <tr className="text-center">
                                    <th>NOMBRE COMPLETO</th>
                                    <th>CORREO</th>
                                    <th>TIPO</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider">
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user._id} className="table-primary text-center">
                                            <td>{user.name} {user.lastname1} {user.lastname2}</td>
                                            <td>{user.email}</td>
                                            <td>{user.type}</td>
                                            <td>
                                                <a href={`users/${user._id}`} className="btn btn-primary me-2">Editar</a>
                                                <button className="btn btn-danger" onClick={() => handleShowDeleteModal(user._id)}>Eliminar</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="table-primary text-center">
                                        <td colSpan="4">No hay usuarios registrados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} ref={modalRef}style={{ display: showDeleteModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}tabIndex="-1"aria-labelledby="deleteUserModalLabel"aria-hidden={!showDeleteModal}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteUserModalLabel">Confirmar Eliminación</h5>
                            <button type="button" className="btn-close" onClick={handleCloseDeleteModal}aria-label="Close"disabled={isDeleting}></button>
                        </div>
                        <div className="modal-body">
                            ¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.
                            {deleteError && (
                                <div className="alert alert-danger mt-3">
                                    {deleteError}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}disabled={isDeleting}>Cancelar</button>
                            <button type="button" className="btn btn-danger" onClick={handleDeleteUser}disabled={isDeleting}>
                                {isDeleting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </>
                                ) : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}