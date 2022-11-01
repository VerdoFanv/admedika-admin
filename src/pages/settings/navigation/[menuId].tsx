import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { postData } from "@utils/fetcher"
import Link from "next/link"
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import AdminMissing from "@components/admin/AdminMissing.component"
import FormCheck from "@components/form/FormCheck.component"
import FormInput from "@components/form/FormInput.component"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import TabsNavigation from "@components/util/Tabs.component"

export function getServerSideProps({ query }) {
	return {
		props: {
			menuId: query.menuId
		}
	}
}

export default function MenuDetail({ menuId }) {
	const { data: settingGeneralData } = useGetData(`/setting-general`)
	const schema = settingGeneralData?.data?.text?.language === `id` ? yup.object({
		ma_name: yup.object({
			id: yup.string().required(`Name (ID) is required`)
		})
	}) : yup.object({
		ma_name: yup.object({
			en: yup.string().required(`Name (EN) is required`)
		})
	})
	const { breadcrumb } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/menu/${menuId}`)
	useLoading(pageIsLoading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/menu/update-header/${menuId}`, {
				ma_name: {
					en: data.ma_name.en,
					id: data.ma_name.id
				},
				menu_link: data.menu_link,
				menu_sort_order: data.menu_sort_order,
				menu_status: data.menu_status === true ? 1 : 2,
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
		if (pageData) {
			reset({
				...pageData.data,
				menu_status: pageData?.data?.menu_status === 1 ? true : false
			})
		}
	}, [ pageData, reset ])

	if (!pageData?.data) return <></>

	return (
		pageData?.status_code === 404 ? (
			<AdminMissing />
		) : (
			<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
				<header className="admin-page-header">
					<AdminHeader
						legend="settings"
						title={`${pageData?.data?.menu_name}`}
						parent={<><Link href={breadcrumb[1]}>Navigation</Link></>}
						action={
							<Access
								auth="write:settings-navigation"
								yes={
									<ul className="actions">
										<li className="action">
											<button type="submit" className="button button-small">Save</button>
										</li>
									</ul>
								}
							/>
						}
					/>
				</header>
				<div className="admin-page-content">
					<section className="section">
						<div className="admin-section">
							<div className="admin-section-body admin-section-body-gray">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="ma_name.en" label="Title (EN)" error={errors.ma_name?.en} />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="ma_name.id" label="Title (ID)" error={errors.ma_name?.id} />
														</div>
													)
												}
											]}
										/>
										{pageData?.data?.menu_link && (
											<div className="row">
												<FormInput setForm={setForm} name="menu_link" label="URL" />
											</div>
										)}
										<div className="row">
											<FormInput setForm={setForm} name="menu_sort_order" label="Sort order (#)" />
										</div>
										<div className="row">
											<FormCheck type="checkbox" setForm={setForm} name="menu_status" label="Active" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</form>
		)
	)
}

MenuDetail.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}