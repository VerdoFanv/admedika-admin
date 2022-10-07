import {
	dashboardPagesNavForAdmedika,
	dashboardPagesNavForMyAdmedika,
	dashboardPagesNavForMyMerchant,
	dashboardPagesNavGeneral,
	dashboardSettingsNav
} from '@variables/dashboardNav.variable'
import { createContext, Dispatch, ReactNode, useEffect } from 'react'
import { useImmerReducer } from 'use-immer'

interface Props {
	children: ReactNode
}

interface Auth {
	email?: string
	name?: string
	role?: string
	status?: string
	uuid?: string
	roleAbility?: {
		read: string[]
		write: string[]
	}
	loginTime?: any
}

interface AuthObjectsPage {
	href: string
	icon: string
	key: string
	label: string
}

interface AuthObjectsSettings {
	href: string
	key: string
	label: string
}

interface AuthObjects {
	page?: AuthObjectsPage[]
	settings?: AuthObjectsSettings[]
}

interface Notification {
	text: string
	isShown?: boolean
	close?: () => void
	footnote?: string
	type?: `info` | `success` | `error`
	align?: string
	autoClose?: number
}

interface PageMemoryAttribute {
	index?: number
	orderBy?: string
}

interface PageMemory {
	productList?: PageMemoryAttribute
	textTranslation?: PageMemoryAttribute
	messageList?: PageMemoryAttribute
	downloadList?: PageMemoryAttribute
	inquiryList?: PageMemoryAttribute
	careerList?: PageMemoryAttribute
	newsPostCategory?: PageMemoryAttribute
	newsPosts?: PageMemoryAttribute
	providerClientIndustry?: PageMemoryAttribute
	complaintList?: PageMemoryAttribute
}

interface AppState {
	isLoading: boolean
	auth: Auth
	authObjects: AuthObjects
	authValues: string[]
	notification: Notification
	pageMemory: PageMemory
}

type Action =
	| { type: `set_isLoading`, payload: boolean }
	| { type: `set_auth`, payload: Auth }
	| { type: `set_authObjects`, payload: AuthObjects }
	| { type: `set_authValues`, payload: string[] }
	| { type: `show_notification`, payload: Notification }
	| { type: `close_notification` }
	| { type: `set_pageMemory`, payload: PageMemory }

const initialState: AppState = {
	isLoading: false,
	auth: {},
	authObjects: {},
	authValues: [],
	notification: {
		isShown: false,
		text: ``,
		footnote: ``,
		type: `info`,
		align: `app`,
		autoClose: 4000
	},
	pageMemory: {},
}

function reducer(state: AppState, action: Action) {
	switch (action.type) {
		case `set_isLoading`:
			state.isLoading = action.payload
			return
		case `set_auth`:
			state.auth = action.payload
			return
		case `set_authObjects`:
			state.authObjects = action.payload
			return
		case `set_authValues`:
			state.authValues = action.payload
			return
		case `show_notification`:
			state.notification = {
				...initialState.notification,
				...action.payload,
				isShown: true
			}
			return
		case `close_notification`:
			state.notification.isShown = false
			return
		case `set_pageMemory`:
			state.pageMemory = {
				...initialState.pageMemory,
				...action.payload
			}
			return
		default:
			return state
	}
}

export const DashboardContext = createContext<{
	state: AppState,
	dispatch: Dispatch<Action>
}>({ state: initialState, dispatch: () => {} })

export default function DashboardContextProvider({ children }: Props) {
	const [ state, dispatch ] = useImmerReducer(reducer, initialState)

	useEffect(() => {
		const allPages = {
			page: [],
			settings: []
		}
		const allPageKeys = []

		const fillPagesAndKey = (pagesNav) => {
			pagesNav.forEach((nav) => {
				allPages.page.push(nav)
				allPageKeys.push(nav.key)

				if (nav.subnav) {
					nav.subnav.forEach((subnav) => {
						const payload = {
							...subnav,
							label: `${nav.label} / ${subnav.label}`
						}

						allPages.page.push(payload)
						allPageKeys.push(payload.key)
					})
				}
			})
		}

		fillPagesAndKey(dashboardPagesNavForAdmedika)
		fillPagesAndKey(dashboardPagesNavForMyAdmedika)
		fillPagesAndKey(dashboardPagesNavForMyMerchant)
		fillPagesAndKey(dashboardPagesNavGeneral)

		dashboardSettingsNav.forEach((nav) => {
			allPages.settings.push(nav)
			allPageKeys.push(nav.key)
		})

		dispatch({ type: `set_authObjects`, payload: allPages })
		dispatch({ type: `set_authValues`, payload: allPageKeys })
	}, [ dispatch ])

	return (
		<DashboardContext.Provider value={{ state, dispatch }}>
			{children}
		</DashboardContext.Provider>
	)
}