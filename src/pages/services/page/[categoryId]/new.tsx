import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormFile from "@components/form/FormFile.component"
import FormInput from "@components/form/FormInput.component"
import FormWysiwyg from "@components/form/FormWysiwyg.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import { postData } from "@utils/fetcher"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import TabsNavigation from "@components/util/Tabs.component"
import * as yup from "yup"
import FormCheck from "@components/form/FormCheck.component"
import FormTextarea from "@components/form/FormTextarea.component"

export default function ServiceSubpageNew() {
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
	const router = useRouter()
	const { categoryId } = router.query
	const { breadcrumb } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)
	const { data: pageParentData } = useGetData(`/page/${categoryId}`)

	const setForm = useForm<any>({
		resolver: yupResolver(schema),
		defaultValues: {
			page_image: ``,
			page_image_tablet: ``,
			page_image_mobile: ``,
			pl_title: {
				en: ``,
				id: ``
			},
			pl_content: {
				en: ``,
				id: ``
			},
			meta: {
				text: {
					quotes: {
						en: ``,
						id: ``
					},
					website: ``,
				},
				file: {
					brochure: ``
				}
			},
			page_sort_order: ``,
			page_status: false,
		}
	})
	const { reset, handleSubmit, formState: { errors } } = setForm

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/page/create`, {
				...data,
				page_parent_id: categoryId,
				page_type: `service-single`,
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

	if (!pageParentData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="Add Subpage"
					legend="services"
					parent={<><Link href={breadcrumb[1]}>Pages</Link> / <Link href={breadcrumb[2]}>{ pageParentData?.data?.page_title }</Link></>}
					action={
						<Access
							auth="write:services-page"
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
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<TabsNavigation
										listLabel={[ `Desktop`, `Tablet`, `Mobile` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="page_image" type="image" label="Background desktop image" size="large" aspectRatio="15/4" title="Recommended size 3840x1012px. Max filesize 3MB. Accepted format: jpg, png." footnote="Recommended size 3840x1012px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="page_image_tablet" type="image" label="Background tablet image" size="large" aspectRatio="11/4" title="Recommended size 2048x764px. Max filesize 3MB. Accepted format: jpg, png." footnote="Recommended size 2048x764px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="page_image_mobile" type="image" label="Background mobile image" size="large" aspectRatio="9/4" title="Recommended size 828x376px. Max filesize 3MB. Accepted format: jpg, png." footnote="Recommended size 828x376px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
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
									<TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormTextarea setForm={setForm} name="meta.text.quotes.en" label="Quotes (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormTextarea setForm={setForm} name="meta.text.quotes.id" label="Quotes (ID)" />
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
														<FormWysiwyg setForm={setForm} name="pl_content.en" label="Content (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwyg setForm={setForm} name="pl_content.id" label="Content (ID)" />
													</div>
												)
											}
										]}
									/>
									<div className="row">
										<FormFile type="image" setForm={setForm} name="meta.image.logo" label="Image logo" size="large" aspectRatio="11/4" footnote="Recommended size 306x100px. Max filesize 2MB. Accepted format: jpg, png." title="Recommended size 306x100px. Max filesize 2MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="meta.text.website" label="Visit Website URL (#)" />
									</div>
									<div className="row">
										<FormFile type="file" setForm={setForm} name="meta.file.brochure" label="File" footnote="Max. 5 MB, .PDF, .DOC, .DOCX" title="Max. 5 MB, .PDF, .DOC, .DOCX" acceptedFormat={[ `.pdf`, `.doc`, `docx` ]} />
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="page_sort_order" label="Page order (#)" />
									</div>
									<div className="row">
										<FormCheck type="checkbox" setForm={setForm} name="page_status" label="Page status" />
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

ServiceSubpageNew.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{ page }
		</Dashboard>
	)
}