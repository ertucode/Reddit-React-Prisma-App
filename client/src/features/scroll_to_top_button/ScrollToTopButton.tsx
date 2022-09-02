import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import "./scroll-button-styles.scss";

interface ScrollToTopButtonProps {}

const invisibleStyle = {
	opacity: "0",
	pointerEvents: "none",
} as React.CSSProperties;

const visibleStyle = {
	opacity: "1",
} as React.CSSProperties;

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = () => {
	const [style, setStyle] = useState<React.CSSProperties>(invisibleStyle);

	useEffect(() => {
		const refreshButtonVisibility = (e: Event) => {
			if (document.documentElement.scrollTop <= 800) {
				setStyle(invisibleStyle);
			} else {
				setStyle(visibleStyle);
			}
		};

		document.addEventListener("scroll", refreshButtonVisibility);

		return () => {
			document.removeEventListener("scroll", refreshButtonVisibility);
		};
	});

	return ReactDom.createPortal(
		<>
			<button
				className="generic-btn scroll-button"
				onClick={() => {
					window.scrollTo(0, 0);
				}}
				style={style}
			>
				Back to Top
			</button>
		</>,
		document.getElementById("root") as Element
	);
};
