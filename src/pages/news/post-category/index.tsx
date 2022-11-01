import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import EiPagination from "@components/ei/EiPagination.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import Link from "next/link"
import { useCallback, useContext, useEffect, useState } from "react"
import IconPlus from "public/assets/icons/icon-plus.svg"
import { useForm } from "react-hook-form"
import TabsNavigation from "@components/util/Tabs.component"
import FormInput from "@components/form/FormInput.component"
import FormCheck from "@components/form/FormCheck.component"
import { postData } from "@utils/fetcher"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { pageId } from "@variables/pageId.variable"

export default function PostCategory() {
	const { data: settingGeneralData } = useGetData(`/setting-general`)
	const schema = settingGeneralData?.data?.text?.language === `id` ? yup.object({
		pl_title: yup.object({
			id: yup.string().required(`Title (ID) is required`)
		})
	}) : yup.object({
		pl_title: yup.object({
			en: yup.string().required(`Title (EN) is required`)
		})
	})
	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { dispatch, state } = useContext(DashboardContext)
	const [ pageIndex, setPageIndex ] = useState(1)
	const [ selectedSort, setSelectedSort ] = useState(`desc`)
	const [ searchQuery, setSearchQuery ] = useState(``)
	const { data: categoryData, isLoading: pageIsLoading } = useGetData(
		`/post-category?sort=${selectedSort}&s=${searchQuery}`
	)
	const { register, handleSubmit, getValues, reset } = setForm
	const { currentPath } = useCurrentPath()
	const sortOrderOptions = [
		{ label: `Sort by Newest`, value: `desc` },
		{ label: `Sort by Oldest`, value: `asc` }
	]
	const { data: pageData, isLoading } = useGetData(`/page/${pageId[`news-category`]}`)

	useEffect(() => {
		dispatch({ type: `set_pageMemory`, payload: { newsPostCategory: { index: pageIndex, orderBy: selectedSort } } })
	}, [ pageIndex, selectedSort, dispatch ])

	useEffect(() => {
		if (state?.pageMemory?.newsPostCategory?.index !== 0 && state?.pageMemory?.newsPostCategory?.index) {
			setPageIndex(state.pageMemory.newsPostCategory.index)
		}
		if (state?.pageMemory?.newsPostCategory?.orderBy !== `` && state?.pageMemory?.newsPostCategory?.orderBy) {
			setSelectedSort(state.pageMemory.newsPostCategory.orderBy)
		}
	}, [])

	const onSubmitSearch = useCallback(() => {
		setSearchQuery(getValues(`searchBar`))
	}, [])

	const submit = async (data) => {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/page/${pageId[`news-category`]}/update`, {
				...data,
				page_status: data.page_status === true ? 1 : 2,
				page_parent_id: pageData.data.page_parent_id,
				page_type: pageData.data.page_type
			})
			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Page has been updated!`
			} })
		} catch (err) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, page cannot be updated!`
			} })
		}

		dispatch({ type: `set_isLoading`, payload: false })
	}

	useEffect(() => {
		reset({
			pl_title: {
				en: pageData?.data.pl_title?.en,
				id: pageData?.data.pl_title?.id,
			},
			page_status: pageData?.data.page_status === 1 ? true : false
		})
	}, [ pageData ])

	return (
		<form className="admin-page" onSubmit={handleSubmit(submit)}>
			<header className="admin-page-header">
				<AdminHeader
					legend="News"
					title="Post Category"
					action={
						<Access
							auth="write:news-post-category"
							yes={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small">Save</button>
									</li>
									<li className="action">
										<Link href={`${currentPath}/new`} passHref><a className="button button-small button-primary"><i className="icon icon-inline" role="img"><IconPlus className="svg" /></i> Add</a></Link>
									</li>
								</ul>
							}
						/>
					}
				/>
			</header>
			<div className="admin-page-content">
				<section className={`section ${isLoading ? `is-loading` : ``}`}>
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">General</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pl_title.en" label="Title (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pl_title.id" label="Title (ID)" />
													</div>
												)
											}
										]}
									/>
									<div className="row">
										<FormCheck setForm={setForm} name="page_status" type="checkbox" label="Status" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<div className="form-search">
					<div className="form-search-field">
						<input type="text" className="input" placeholder="Search Here" {...register(`searchBar`)} />
						<button type="button" className="button button-alt" onClick={onSubmitSearch}>Search</button>
					</div>
				</div>
				<div className="admin-data-filters">
					<div className="admin-data-filter">
						<select name="sort" id="sort" className="input" onChange={(ev) => setSelectedSort(ev.target.value)} value={selectedSort}>
							{sortOrderOptions.map((item, i) =>
								<option
									key={i}
									value={item.value}
								>
									{item.label}
								</option>)}
						</select>
					</div>
				</div>
				<div className="admin-data">
					<div className={`admin-data-table ${pageIsLoading ? `is-loading` : ``}`}>
						<table className="table">
							<thead>
								<tr>
									<th>Name</th>
									<th className="right">Status</th>
								</tr>
							</thead>
							<tbody>
								{categoryData?.data && (
									categoryData.data.map((list) => (
										<Link
											key={list[`post_cat_id`]}
											href={{
												pathname: `${currentPath}/${list[`post_cat_id`]}`,
											}}
											passHref
										>
											<tr className="linkable">
												<td>
													<p>
														{list.post_cat_name}
													</p>
												</td>
												<td className="right">
													{list[`post_cat_status`] === 1 &&
														<span className="badge badge-green">Active</span>
													}
													{list[`post_cat_status`] === 2 &&
														<span className="badge">Inactive</span>
													}
												</td>
											</tr>
										</Link>
									))
								)}
							</tbody>
						</table>
					</div>
					{categoryData?.data && (
						<div className="admin-data-foot">
							<EiPagination
								data={categoryData.meta}
								pageIndex={pageIndex}
								setPageIndex={setPageIndex}
							/>
						</div>
					)}
				</div>
			</div>
		</form>
	)
}

PostCategory.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}