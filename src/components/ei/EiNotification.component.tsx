import { AnimatePresence, motion } from 'framer-motion'
import IconClose from 'public/assets/icons/icon-close.svg'
import { useEffect, useMemo } from 'react'

interface Props {
	isShown: boolean
	close: () => void
	text: string
	footnote?: string
	type?: `info` | `success` | `error`
	align?: string
	autoClose?: number
}

const EiNotification = ({ isShown, close, text, footnote, type = `info`, align = `global`, autoClose }: Props) => {
	const state = useMemo(() => ({ isShown, close, autoClose }), [ isShown, close, autoClose ])
	const viewMotion = {
		hidden: {
			opacity: 0,
			y: `-24px`,
			transition: {
				type: `spring`,
			}
		},
		visible: {
			opacity: 1,
			y: `0`
		}
	}

	function closePopupBox(ev) {
		if (ev.target === ev.currentTarget) {
			close()
		}
	}

	useEffect(() => {
		if (state.isShown && state.autoClose) {
			setTimeout(() => {
				state.close()
			}, state.autoClose)
		}
	}, [ state ])

	return (
		<AnimatePresence>
			{isShown && text &&
				<motion.div className={`ei-notification ei-notification-${align} ei-notification-${type}`} variants={viewMotion} initial="hidden" animate="visible" exit="hidden">
					<div className="ei-notification-inner">
						<div className="ei-notification-text">
							<p className="text">{text}</p>
							{footnote &&
								<p className="footnote">{footnote}</p>
							}
						</div>
						<button onClick={(ev) => closePopupBox(ev)} className="ei-notification-close link"><i className="icon" role="img"><IconClose className="svg" /></i></button>
					</div>
				</motion.div>
			}
		</AnimatePresence>
	)
}

export default EiNotification
