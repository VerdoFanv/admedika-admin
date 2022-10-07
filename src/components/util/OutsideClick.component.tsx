import { useEffect, useRef } from 'react'

function useOutsideClick(ref, runFunction) {
	useEffect(() => {
		function handleClickOutside(ev) {
			if (ref.current && !ref.current.contains(ev.target)) {
				runFunction()
			}
		}

		document.addEventListener(`mousedown`, handleClickOutside)
		return () => {
			document.removeEventListener(`mousedown`, handleClickOutside)
		}
	}, [ ref, runFunction ])
}

export default function OutsideAlerter({ children, runFunction }) {
	const wrapperRef = useRef(null)
	useOutsideClick(wrapperRef, runFunction)

	return (
		<div ref={wrapperRef}>{children}</div>
	)
}