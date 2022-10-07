import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import EiPagination from "@components/ei/EiPagination.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function TextHardCode() {
	const { dispatch, state } = useContext(DashboardContext)
	const [ pageIndex, setPageIndex ] = useState(1)
	const [ searchKey, setSearchKey ] = useState(``)
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/text-hardcode?page=${pageIndex}&s=${searchKey}`)
	const { handleSubmit, register } = useForm()
	const { currentPath } = useCurrentPath()

	async function onSubmit(data) {
		if (data) {
			setSearchKey(data.search)
			setPageIndex(1)
		}
	}

	useLoading(pageIsLoading)

	useEffect(() => {
		dispatch({ type: `set_pageMemory`, payload: { textTranslation: { index: pageIndex } } })
	}, [ pageIndex, dispatch ])

	useEffect(() => {
		if (state?.pageMemory?.textTranslation?.index !== 0 && state?.pageMemory?.textTranslation?.index) {
			setPageIndex(state.pageMemory.textTranslation.index)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (!pageData) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="Word Translation"
				/>
			</header>
			<div className="admin-page-content">
				<div className="form-search">
					<div className="form-search-field">
						<input type="text" className="input" placeholder="Search Here" {...register(`search`)} />
						<button type="submit" className="button button-alt">Search</button>
					</div>
				</div>
				<div className="admin-data">
					<div className="admin-data-table">
						<table className="table table-fixed table-nowrap">
							<thead>
								<tr>
									<th>Key</th>
									<th>EN</th>
									<th>ID</th>
								</tr>
							</thead>
							<tbody>
								{pageData?.data?.map((list) =>
									<Link
										key={list[`id`]}
										href={{
											pathname: `${currentPath}/${list[`id`]}&page=${pageIndex}`
										}}
										passHref
									>
										<tr className="linkable">
											<td>
												<p className="strong">{list[`key`]}</p>
											</td>
											<td>{list.text.en}</td>
											<td>{list.text.id}</td>
										</tr>
									</Link>
								)}
							</tbody>
						</table>
					</div>
					<div className="admin-data-foot">
						<EiPagination data={pageData.meta} pageIndex={pageIndex} setPageIndex={setPageIndex} />
					</div>
				</div>
			</div>
		</form>
	)
}

TextHardCode.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}