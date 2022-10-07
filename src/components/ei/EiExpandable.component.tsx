import { heightMotion } from '@variables/motion.variable'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useState } from 'react'

interface Props {
	children: ReactNode
	title: String
	desc?: String
}

export default function EiExpandable({ children, title, desc }: Props) {
	const [ isToggled, setIsToggled ] = useState(false)

	return (
		<div className={`ei-expandable ${isToggled ? `is-toggled` : ``}`}>
			<div className="ei-expandable-head">
				<div className="text">
					<h4 className="title">{title}</h4>
					<p className="desc">{desc}</p>
				</div>
				<button type="button" onClick={() => setIsToggled(!isToggled)} className="button button-small button-gray">{isToggled ? `Close` : `Expand`}</button>
			</div>
			<AnimatePresence>
				{isToggled &&
					<motion.div className="ei-expandable-body" variants={heightMotion} initial="hidden" animate="visible" exit="hidden">
						<div className="inner">
							{children}
						</div>
					</motion.div>
				}
			</AnimatePresence>
		</div>
	)
}