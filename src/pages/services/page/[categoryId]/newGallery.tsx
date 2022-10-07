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
import { useRouter } from "next/router"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import TabsNavigation from "@components/util/Tabs.component"
import * as yup from "yup"
import FormCheck from "@components/form/FormCheck.component"
import FormRepeater from "@components/form/FormRepeater.component"

export default function ServiceCategoryImageGalleryNew() {
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
	const { data: pageData } = useGetData(`/page/${categoryId}`)

	const setForm = useForm<any>({
		resolver: yupResolver(schema),
		defaultValues: {
			page_image: ``,
			pl_title: {
				en: ``,
				id: ``
			},
			meta: {
				repeater: {
					gallery: []
				}
			},
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
				page_type: `service-gallery`,
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

	if (!pageData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="Add Image Gallery"
					legend="services"
					parent={
						<>
							<Link href={breadcrumb[1]}>Pages</Link> / <Link href={breadcrumb[2]}>{ pageData?.data?.page_title }</Link>
						</>
					}
					action={
						<Access
							auth="write:services-page"
							yes={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small">Add Image Gallery</button>
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
									<div className="row">
										<FormFile type="image" label="Page Image" setForm={setForm} name="page_image" size="large" aspectRatio="10/7" footnote="Recommended size 1106x797px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 1106x797px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
									</div>
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
										<FormInput setForm={setForm} name="page_sort_order" label="Page order (#)" />
									</div>
									<div className="row">
										<FormCheck type="checkbox" setForm={setForm} name="page_status" label="Status" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h1 className="title">Image Gallery</h1>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormRepeater
											setForm={setForm}
											name="meta.repeater.gallery"
											inputNames={[ `image`, `image_nav`, `image_alt` ]}
											inputTypes={[ `image`, `image`, `text` ]}
											inputLabels={[ `Image Preview`, `Image Nav`, `Alt` ]}
											inputWidths={[ `20%`, `10%`, `auto` ]}
											inputProps={[
												{
													size: `large`,
													aspectRatio: `11/6`,
													title: `Recommended size 2392x1347px. Max filesize 5MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 2392x1347px. Max filesize 5MB. Accepted format: jpg, png.`,
													styleNoButton: true,
													styleNoPlaceholder: true
												},
												{
													size: `medium`,
													aspectRatio: `10/6`,
													title: `Recommended size 572x321px. Max filesize 2MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 572x321px. Max filesize 2MB. Accepted format: jpg, png.`,
													styleNoButton: true,
													styleNoPlaceholder: true
												}
											]}
											sortable
										/>
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

ServiceCategoryImageGalleryNew.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{ page }
		</Dashboard>
	)
}