import DashboardContextProvider from "@contexts/DashboardContext.context"
import '@styles/app.scss'
import { AppProps } from "next/app"
import { ReactNode } from "react"

type Props = AppProps & {
	Component: any
};

export default function App({ Component, pageProps }: Props) {
	const getLayout = Component.getLayout ?? ((page: ReactNode) => page)

	return (
		<DashboardContextProvider>
			<div className="app">
				{getLayout(<Component {...pageProps} />)}
			</div>
		</DashboardContextProvider>
	)
}
