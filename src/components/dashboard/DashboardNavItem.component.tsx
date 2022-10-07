import NavLink from '@components/util/NavLink.component'
import { heightMotion } from '@variables/motion.variable'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import IconHome from 'public/assets/icons/icon-home.svg'
import IconProduct from 'public/assets/icons/icon-product.svg'
import IconChevronDown from 'public/assets/icons/icon-chevron-down.svg'
import IconCode from 'public/assets/icons/icon-code.svg'
import IconContact from 'public/assets/icons/icon-contact-alt.svg'
import IconInfo from 'public/assets/icons/icon-info.svg'
import IconLocation from 'public/assets/icons/icon-location.svg'
import IconNewsPaper from 'public/assets/icons/icon-newspaper.svg'
import IconPages from 'public/assets/icons/icon-pages.svg'
import IconSearch from 'public/assets/icons/icon-search.svg'
import IconService from 'public/assets/icons/icon-service-medical.svg'
import IconTerms from 'public/assets/icons/icon-pages.svg'
import IconCareer from 'public/assets/icons/icon-career.svg'
import IconPartner from 'public/assets/icons/icon-partner.svg'
import IconFaq from 'public/assets/icons/icon-faq.svg'
import IconStore from 'public/assets/icons/icon-store.svg'
import { useEffect, useState } from 'react'
import Access from '@components/util/Access.component'
interface Props {
	href: string
	redirectHref?: string
	icon?: any
	label: string
	subnav?: Subnav[]
	hasNew?: boolean
}

interface Subnav {
	key: string
	href: string
	redirectHref?: string
	label: string
}

export default function DashboardNavItem({ href, redirectHref, icon, label, subnav, hasNew }: Props) {
	const [ isToggled, setIsToggled ] = useState(false)
	const { asPath } = useRouter()

	useEffect(() => {
		if (asPath === href || asPath.startsWith(href)) {
			setIsToggled(true)
		}
	}, [ asPath, href ])

	return (
		<li className="dashboard-nav-item">
			<div className="linker">
				<NavLink href={href} redirectHref={redirectHref} activeClassName="is-current">
					{icon ?
						<button className={`link ${hasNew ? `is-updated` : ``}`}>
							<i className="icon" role="img">
								{icon === `IconHome` &&
									<IconHome className="svg" />
								}
								{icon === `IconProduct` &&
									<IconProduct className="svg" />
								}
								{icon === `IconCode` &&
									<IconCode className="svg" />
								}
								{icon === `IconContact` &&
									<IconContact className="svg" />
								}
								{icon === `IconInfo` &&
									<IconInfo className="svg" />
								}
								{icon === `IconLocation` &&
									<IconLocation className="svg" />
								}
								{icon === `IconNewsPaper` &&
									<IconNewsPaper className="svg" />
								}
								{icon === `IconPages` &&
									<IconPages className="svg" />
								}
								{icon === `IconSearch` &&
									<IconSearch className="svg" />
								}
								{icon === `IconService` &&
									<IconService className="svg" />
								}
								{icon === `IconTerms` &&
									<IconTerms className="svg" />
								}
								{icon === `IconCareer` &&
									<IconCareer className="svg" />
								}
								{icon === `IconPartner` &&
									<IconPartner className="svg" />
								}
								{icon === `IconFaq` &&
									<IconFaq className="svg" />
								}
								{icon === `IconStore` &&
									<IconStore className="svg" />
								}
							</i>
							{label}
						</button>
						:
						<button className={`link ${hasNew ? `is-updated` : ``}`}>{label}</button>
					}
				</NavLink>
				{subnav &&
					<button className={`toggle ${isToggled ? `is-toggled` : ``}`} onClick={() => setIsToggled(!isToggled)}><i className="icon" role="img"><IconChevronDown className="svg" /></i></button>
				}
			</div>
			{subnav &&
			<AnimatePresence>
				{isToggled &&
				<motion.ul className="dashboard-nav-items" variants={heightMotion} initial="hidden" animate="visible" exit="hidden">
					{subnav.map(nav =>
						<Access
							key={nav.key}
							auth={`read:${nav.key}`}
							yes={
								<NavLink key={nav.key} href={nav.href} redirectHref={nav.redirectHref} activeClassName="is-current">
									<button className="link">{nav.label}</button>
								</NavLink>
							}
						/>
					)}
				</motion.ul>
				}
			</AnimatePresence>
			}
		</li>
	)
}