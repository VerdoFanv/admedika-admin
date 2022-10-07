import { AnimatePresence, motion } from 'framer-motion'
import IconClose from 'public/assets/icons/icon-close.svg'
import { ReactElement, useEffect } from 'react'

interface Props {
	children: ReactElement
	isLoading?: boolean
	isShown: boolean
	close?: (event: any) => void
	title?: string
	closeOutside?: boolean
	closeIcon?: boolean
	styleSmall?: boolean
	styleLarge?: boolean
}

export default function EiPopup({ children, isLoading, isShown, close, title, closeOutside, closeIcon, styleSmall, styleLarge }: Props) {
	const viewMotion = {
		hidden: {
			opacity: 0,
			transition: {
				type: `tween`,
				ease: `easeInOut`,
				delay: 0.1
			}
		},
		visible: {
			opacity: 1,
			transition: {
				type: `tween`,
				ease: `easeInOut`,
				duration: 0.3
			}
		}
	}
	const wrapperMotion = {
		hidden: {
			opacity: 0,
			y: `10%`,
			transition: {
				type: `tween`,
				ease: `easeInOut`,
				duration: 0.2
			}
		},
		visible: {
			opacity: 1,
			y: `0`,
			transition: {
				type: `spring`,
				damping: 10,
				mass: 0.2
			}
		}
	}

	function closeEiPopup(ev) {
		if (ev.target === ev.currentTarget) {
			close(ev)
		}
	}

	useEffect(() => {
		if (isShown) {
			document.body.classList.add(`ei-popup-open`)
		} else {
			document.body.classList.remove(`ei-popup-open`)
		}
	}, [ isShown ])

	return (
		<AnimatePresence>
			{isShown &&
			<motion.div className="ei-popup" variants={viewMotion} initial="hidden" animate="visible" exit="hidden">
				<motion.div onClick={(ev) => closeOutside && closeEiPopup(ev)} className="ei-popup-wrapper" variants={wrapperMotion}>
					<div className={`ei-popup-content ${styleSmall ? `ei-popup-content-small` : ``} ${styleLarge ? `ei-popup-content-large` : ``} ${isLoading ? `is-loading` : ``}`}>
						{closeIcon &&
						<button type="button" onClick={(ev) => closeEiPopup(ev)} className="ei-popup-close"><i className="icon" role="img"><IconClose className="svg" /></i></button>
						}
						{title &&
						<div className="ei-popup-head">
							<h4 className="title">{title}</h4>
						</div>
						}
						<div className="ei-popup-body">{children}</div>
					</div>
				</motion.div>
			</motion.div>
			}
		</AnimatePresence>
	)
}
