import React, { useEffect } from "react";
import ReactDom from "react-dom";
import "../styles/modal.scss";

interface ModalProps {
	children: React.ReactNode;
	setOpen: (open: boolean) => void;
}

export const Modal: React.FC<ModalProps> = ({ children, setOpen }) => {
	useEffect(() => {
		function escFunction(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setOpen(false);
			}
		}

		document.addEventListener("keydown", escFunction, false);

		return () => {
			document.removeEventListener("keydown", escFunction, false);
		};
	}, [setOpen]);

	return ReactDom.createPortal(
		<>
			<div className="modal-overlay" onClick={() => setOpen(false)}></div>
			<div className="modal-body" onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</>,
		document.getElementById("root") as Element
	);
};
