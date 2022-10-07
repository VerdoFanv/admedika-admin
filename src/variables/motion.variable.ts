export const heightMotion = {
	hidden: {
		height: 0,
		opacity: 0,
		overflow: `hidden`,
		transition: {
			type: `tween`,
			ease: `easeInOut`,
			duration: 0.2
		}
	},
	visible: {
		height: `auto`,
		opacity: 1,
		overflow: `hidden`,
		transition: {
			type: `tween`,
			ease: `easeInOut`,
			duration: 0.2
		}
	}
}

export const slideupMotion = {
	hidden: {
		y: 32,
		opacity: 0,
		transition: {
			type: `tween`,
			ease: `easeInOut`,
			duration: 0.2
		}
	},
	visible: {
		y: 0,
		opacity: 1
	}
}

export const slidedownMotion = {
	hidden: {
		y: -8,
		opacity: 0,
		transition: {
			type: `tween`,
			ease: `easeInOut`,
			duration: 0.2
		}
	},
	visible: {
		y: 0,
		opacity: 1
	}
}