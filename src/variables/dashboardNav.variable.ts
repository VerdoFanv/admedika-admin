interface SubNav {
	key: string
	href: string
	label: string
}

export interface PagesNav {
	key: string
	href: string
	redirectHref?: string
	label: string
	icon?: string
	hasNew?: boolean
	subnav?: SubNav[]
}

export const dashboardPagesNavForAdmedika: PagesNav[] = [
	{
		key: `home`,
		href: `/home-admedika`,
		label: `Home`,
		icon: `IconHome`,
	},
	{
		key: `about`,
		href: `/about`,
		label: `About Us`,
		icon: `IconInfo`,
	},
	{
		key: `services`,
		href: `/services`,
		redirectHref: `/services/page`,
		label: `Services`,
		icon: `IconService`,
		subnav: [
			{
				key: `services-page`,
				href: `/services/page`,
				label: `Pages`,
			},
			{
				key: `services-download-list`,
				href: `/services/download`,
				label: `Download List`
			},
			{
				key: `services-inquiry-list`,
				href: `/services/inquiry`,
				label: `Inquiry List`
			}
		]
	},
	{
		key: `career`,
		href: `/career`,
		label: `Career`,
		redirectHref: `/career/page`,
		icon: `IconCareer`,
		subnav: [
			{
				key: `career-page`,
				href: `/career/page`,
				label: `Page`
			},
			{
				key: `career-list`,
				href: `/career/list`,
				label: `Apply List`
			},
			{
				key: `career-division-list`,
				href: `/career/division-list`,
				label: `Division List`
			}
		]
	},
	{
		key: `news`,
		href: `/news`,
		label: `News & Publication`,
		icon: `IconNewsPaper`,
		redirectHref: `/news/post-category`,
		subnav: [
			{
				key: `news-post-category`,
				href: `/news/post-category`,
				label: `Post Category`
			},
			{
				key: `news-posts`,
				href: `/news/posts`,
				label: `Posts`
			},
			{
				key: `news-download`,
				href: `/news/download`,
				label: `Download Corner`
			},
			{
				key: `news-faq`,
				href: `/news/faq`,
				label: `FAQ`
			}
		]
	},
	{
		key: `provider`,
		href: `/provider`,
		label: `Provider & Partners`,
		redirectHref: `/provider/industry`,
		icon: `IconPartner`,
		subnav: [
			{
				key: `provider-clients-industry`,
				href: `/provider/industry`,
				label: `Clients Industry`
			},
			{
				key: `provider-clients`,
				href: `/provider/clients`,
				label: `Clients`
			},
			{
				key: `provider-network`,
				href: `/provider/network`,
				label: `Network`
			},
			{
				key: `provider-become`,
				href: `/provider/become`,
				label: `Become`
			}
		]
	},
	{
		key: `contact`,
		href: `/contact`,
		redirectHref: `/contact/page`,
		label: `Contact`,
		icon: `IconContact`,
		subnav: [
			{
				key: `contact-page`,
				href: `/contact/page`,
				label: `Page`
			},
			{
				key: `contact-list`,
				href: `/contact/list`,
				label: `Message List`
			},
			{
				key: `contact-department-list`,
				href: `/contact/department-list`,
				label: `Department List`
			}
		]
	},
	{
		key: `terms`,
		href: `/terms`,
		label: `Terms`,
		icon: `IconTerms`
	},
	{
		key: `search`,
		href: `/search`,
		label: `Search`,
		icon: `IconSearch`,
	}
]

export const dashboardPagesNavForMyAdmedika: PagesNav[] = [
	{
		key: `home-myadmedika`,
		href: `/home-myadmedika`,
		label: `Home`,
		icon: `IconHome`,
	},
	{
		key: `faq-myadmedika`,
		href: `/faq`,
		label: `FAQ`,
		icon: `IconFaq`
	}
]

export const dashboardPagesNavForMyMerchant: PagesNav[] = [
	{
		key: `home-mymerchant`,
		href: `/home-mymerchant`,
		label: `Home`,
		icon: `IconHome`,
	},
	{
		key: `merchant-mymerchant`,
		href: `/merchant`,
		label: `Merchant`,
		icon: `IconStore`
	},
	{
		key: `complaint-mymerchant`,
		href: `/complaint`,
		label: `Complaint`,
		icon: `IconInfo`
	}
]

export const dashboardPagesNavGeneral: PagesNav[] = [
	{
		key: `translation-general`,
		href: `/translation`,
		label: `Word Translation`,
		icon: `IconCode`
	}
]

export const dashboardSettingsNav: PagesNav[] = [
	{
		key: `settings-general`,
		href: `/settings/general`,
		label: `General`
	},
	{
		key: `settings-navigation`,
		href: `/settings/navigation`,
		label: `Navigation`
	},
	{
		key: `settings-mail`,
		href: `/settings/mail`,
		label: `Mail`,
	},
	{
		key: `settings-users`,
		href: `/settings/users`,
		label: `Users`
	}
]