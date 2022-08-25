import React, { useCallback, useContext, useState } from "react";
import { Modal } from "../components/Modal";

interface ModalContextProps {
	children: React.ReactNode;
}

const ModalContext = React.createContext({
	setModalOpen: (state: boolean) => {},
	setModalChildren: (children: React.ReactNode) => {},
	setModalClassName: (name: string) => {},
	resetModal: () => {},
});

export const useModal = () => {
	return useContext(ModalContext);
};

export const ModalContextProvider: React.FC<ModalContextProps> = ({
	children,
}) => {
	const [open, setOpen] = useState(false);
	const [modalChildren, setModalChildren] = useState<React.ReactNode>();
	const [modalClassName, setModalClassName] = useState("");

	const setModalOpen = useCallback(
		(state: boolean) => {
			setOpen(state);
		},
		[setOpen]
	);

	return (
		<ModalContext.Provider
			value={{
				setModalOpen,
				setModalChildren,
				setModalClassName,
				resetModal: () => {
					setModalChildren(null);
					setModalClassName("");
					setModalOpen(false);
				},
			}}
		>
			<>
				{children}
				<Modal
					open={open}
					setOpen={setOpen}
					modalClassName={modalClassName}
				>
					{modalChildren}
				</Modal>
			</>
		</ModalContext.Provider>
	);
};
