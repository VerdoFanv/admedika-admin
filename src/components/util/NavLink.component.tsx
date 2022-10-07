import Link from 'next/link'
import { useRouter } from 'next/router'
import { Children, cloneElement, ReactElement } from 'react'

interface Props {
	children: ReactElement
	href: string
	redirectHref?: string
	activeClassName?: string
	activeParentClassName?: string
	[x: string]: any
}

export default function NavLink({ children, href, redirectHref, activeClassName = `is-current`, activeParentClassName = `is-current-parent`, ...props }: Props) {
	const { asPath } = useRouter()
	const child = Children.only(children)
	const childClassName = child.props.className || ``

	let className = childClassName

	if (asPath === href) {
		className = `${className} ${activeClassName}`
	} else if (asPath.startsWith(href)) {
		className = `${className} ${activeParentClassName}`
	}

	return (
		<Link href={redirectHref || href} {...props}>
			{cloneElement(child, {
				className: className || null,
			})}
		</Link>
	)
}