import { useRef, forwardRef, useImperativeHandle } from 'react';

const PrivacyPolicy = forwardRef((props, ref) => {
    const offcanvasRef = useRef(null);
  
    useImperativeHandle(ref, () => ({
        show: () => {
            new window.bootstrap.Offcanvas(offcanvasRef.current).show();
        }
    }));

  return (
    <div className="offcanvas offcanvas-bottom" ref={offcanvasRef} tabIndex="-1" id="privacyOffcanvas" aria-labelledby="privacyOffcanvasLabel" data-bs-backdrop="static">
        <div className="offcanvas-header">
            <h5 className="offcanvas-title text-capitalize" id="privacyOffcanvasLabel">Políticas de privacidad</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body small">
            La presente Política de Privacidad establece los términos en los que Erwin's (en adelante, «nosotros» o «la empresa») utiliza y protege la información
            que recoge del usuario (en adelante, «tú» o «el usuario») al utilizar nuestro sitio web, <a href={process.env.REACT_APP_API_URL}>{process.env.REACT_APP_API_URL}</a> (en adelante, «el sitio»).
            Nos comprometemos a asegurar que tu privacidad esté protegida. Si te pedimos que proporciones cierta información mediante la cual puedas ser identificado
            al utilizar este sitio, puedes estar seguro de que solo se usará para Personalizar tu experiencia, Mejorar nuestro servicio y Enviar comunicaciones importantes.
        </div>
    </div>
  );
});

export default PrivacyPolicy;