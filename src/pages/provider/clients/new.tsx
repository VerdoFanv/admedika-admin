import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import Link from "next/link"
import useGetData from "@hooks/useGetData.hook"
import * as yup from "yup"
import { useContext } from "react"
import { postData } from "@utils/fetcher"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { DashboardContext } from "@contexts/DashboardContext.context"
import FormInput from "@components/form/FormInput.component"
import TabsNavigation from "@components/util/Tabs.component"
import FormFile from "@components/form/FormFile.component"
import FormCheck from "@components/form/FormCheck.component"
import FormSelect from "@components/form/FormSelect.component"

export default function ProviderClientsSingleNew() {
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
	const { breadcrumb } = useCurrentPath()
	const { dispatch } = useContext(DashboardContext)

	const setForm = useForm<any>({
		defaultValues: {
			pl_title: {
				en: ``,
				id: ``
			},
			pl_content: {
				en: ``,
				id: ``
			},
			page_image: ``,
			page_status: false,
			meta: {
				text: {
					industry_id: ``
				}
			}
		},
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: mainPage } = useGetData(`/page/6`)
	const pageId = mainPage?.data?.page_sub.find((page) => page.page_type === `provider-client`).page_id
	const { data: industryDatas } = useGetData(`/list/client-industry`)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/page/create`, {
				...data,
				page_parent_id: pageId,
				page_type: `provider-client-single`,
				page_status: data.page_status === true ? 1 : 2,
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
					title="Add Single"
					legend="provider"
					parent={<Link href={breadcrumb[1]}>Clients</Link>}
					action={
						<Access
							auth="write:provider-clients"
							yes={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small">Add Single</button>
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
									<div className="row">
										<FormFile setForm={setForm} name="page_image" type="image" label="Background image" size="large" aspectRatio="15/4" footnote="Recommended size 3840x1012px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 3840x1012px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
									</div>
									<TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pl_title.en" label="Title (EN)" error={errors?.pl_title?.en} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pl_title.id" label="Title (ID)" error={errors?.pl_title?.id} />
													</div>
												)
											}
										]}
									/>
									<div className="row">
										<FormSelect setForm={setForm} name="meta.text.industry_id" label="Industry" options={industryDatas?.data?.map((item) => ({ value: item.id, label: item.name }))} />
									</div>
									<div className="row">
										<FormCheck setForm={setForm} name="page_status" label="Publish" type="checkbox"/>
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

ProviderClientsSingleNew.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{ page }
		</Dashboard>
	)
}