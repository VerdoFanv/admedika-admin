import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormCheck from "@components/form/FormCheck.component"
import FormFile from "@components/form/FormFile.component"
import FormInput from "@components/form/FormInput.component"
import FormSelect from "@components/form/FormSelect.component"
import FormWysiwyg from "@components/form/FormWysiwyg.component"
import Access from "@components/util/Access.component"
import TabsNavigation from "@components/util/Tabs.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import { postData } from "@utils/fetcher"
import Link from "next/link"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

export default function CareerPageNew() {
	const { data: settingGeneralData } = useGetData(`/setting-general`)
	const { data: divisionData } = useGetData(`/option/career-division`)
	const schema = settingGeneralData?.data?.text?.language === `id` ? yup.object({
		pl_title: yup.object({
			id: yup.string().required(`Title (ID) is required`)
		})
	}) : yup.object({
		pl_title: yup.object({
			en: yup.string().required(`Title (EN) is required`)
		})
	})
	const { dispatch } = useContext(DashboardContext)
	const { breadcrumb } = useCurrentPath()
	const setForm = useForm<any>({
		defaultValues: {
			page_status: false,
			page_image: ``,
			page_image_tablet: ``,
			page_image_mobile: ``,
			pl_title: {
				en: ``,
				id: ``
			},
			meta: {
				text: {
					division_name: ``,
					requirement: {
						en: ``,
						id: ``
					},
					job_desc: {
						en: ``,
						id: ``
					}
				}
			},
			page_sort_order: ``,
		},
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: pageId } = useGetData(`/page/list-page-id`)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await postData(`/page/create`, {
				...data,
				page_type: `career-single`,
				page_parent_id: pageId?.data?.page_id[`career`],
				page_status: data.page_status === true ? 1 : 2,
			})
			reset()
			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Page has been added!`
			} })
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
					title="Add Subpage"
					legend="career"
					parent={<><Link href={breadcrumb[0]}>Page</Link></>}
					action={
						<Access
							auth="write:career-page"
							yes={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small">Add Subpage</button>
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
						<div className="admin-section-head">
							<h1 className="title">General</h1>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<TabsNavigation
										listLabel={[ `Desktop`, `Tablet`, `Mobile` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="page_image" type="image" label="Background desktop image" size="large" aspectRatio="15/4" footnote="Recommended size 3840x1012px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 3840x1012px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="page_image_tablet" type="image" label="Background tablet image" size="large" aspectRatio="11/4" footnote="Recommended size 2048x764px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 2048x764px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="page_image_mobile" type="image" label="Background mobile image" size="large" aspectRatio="9/4" footnote="Recommended size 828x376px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 828x376px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
													</div>
												)
											}
										]}
									/>
									<TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pl_title.en" label="Title (EN)" error={errors.pl_title?.en} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pl_title.id" label="Title (ID)" error={errors.pl_title?.id} />
													</div>
												)
											}
										]}
									/>
									<div className="row">
										<FormSelect setForm={setForm} options={divisionData?.data?.option.map((item) => ({ value: item.div_name, label: item.div_name }))} name="meta.text.division_name" label="Division" />
									</div>
									<div className="row">
										<FormCheck type="checkbox" setForm={setForm} name="page_status" label="Page Status" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h1 className="title">Requirement</h1>
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
														<FormWysiwyg setForm={setForm} name="meta.text.requirement.en" label="Requirement (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwyg setForm={setForm} name="meta.text.requirement.id" label="Requirement (ID)" />
													</div>
												)
											}
										]}
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h1 className="title">Job Description</h1>
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
														<FormWysiwyg setForm={setForm} name="meta.text.job_desc.en" label="Job Description (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwyg setForm={setForm} name="meta.text.job_desc.id" label="Job Description (ID)" />
													</div>
												)
											}
										]}
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</form>
	)
}

CareerPageNew.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}