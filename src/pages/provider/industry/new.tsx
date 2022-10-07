import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormInput from "@components/form/FormInput.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import { postData } from "@utils/fetcher"
import Link from "next/link"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import TabsNavigation from "@components/util/Tabs.component"
import * as yup from "yup"
import FormCheck from "@components/form/FormCheck.component"

export default function NewsPostCategoryNew() {
	const { data: settingGeneralData } = useGetData(`/setting-general`)
	const schema = settingGeneralData?.data?.text?.language === `id` ? yup.object({
		pcil_name: yup.object({
			id: yup.string().required(`Name (ID) is required`)
		})
	}) : yup.object({
		pcil_name: yup.object({
			en: yup.string().required(`Name (EN) is required`)
		})
	})
	const { breadcrumb } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)

	const setForm = useForm<any>({
		defaultValues: {
			pcil_name: {
				en: ``,
				id: ``
			},
			pci_status: false,
		},
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/provider-client-industry/create`, {
				...data,
				pci_status: data.pci_status === true ? 1 : 2,
			})
			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Page has been added!`
			} })
			reset()
		} catch (err) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, page cannot be added!`
			} })
		}

		dispatch({ type: `set_isLoading`, payload: false })
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					legend="provider"
					title="Add Industry"
					parent={<><Link href={breadcrumb[1]}>Clients Industry</Link></>}
					action={
						<Access
							auth="write:news-post-category"
							yes={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small">Add Industry</button>
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
														<FormInput setForm={setForm} name="pcil_name.en" label="Name (EN)" error={errors.pcil_name?.en} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pcil_name.id" label="Name (ID)" error={errors.pcil_name?.id} />
													</div>
												)
											}
										]}
									/>
									<div className="row">
										<FormCheck setForm={setForm} name="post_status" type="checkbox" label="Status" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</form>
	)
}

NewsPostCategoryNew.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}