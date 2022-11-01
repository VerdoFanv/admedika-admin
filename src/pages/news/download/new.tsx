import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormFile from "@components/form/FormFile.component"
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
import FormWysiwygColorPickerOnly from "@components/form/FormWysiwygColorPickerOnly.component"
import FormCheck from "@components/form/FormCheck.component"
import { pageId } from "@variables/pageId.variable"

export default function NewsDownloadCategoryNew() {
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
			page_image_tablet: ``,
			page_image_mobile: ``,
			page_status: false,
		},
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/page/create`, {
				...data,
				page_parent_id: pageId[`news-download-corner`],
				page_type: `download-corner-category`,
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
					legend="news"
					title="Add Category"
					parent={<><Link href={breadcrumb[1]}>Download Corner</Link></>}
					action={
						<Access
							auth="write:news-download"
							yes={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small">Add category</button>
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
									<TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="pl_content.en" label="Content (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="pl_content.id" label="Content (ID)" />
													</div>
												)
											}
										]}
									/>
									<div className="row">
										<FormCheck setForm={setForm} name="page_status" type="checkbox" label="Publish" />
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

NewsDownloadCategoryNew.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}