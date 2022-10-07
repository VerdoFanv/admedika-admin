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
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import TabsNavigation from "@components/util/Tabs.component"
import * as yup from "yup"
import FormWysiwyg from "@components/form/FormWysiwyg.component"
import FormSelect from "@components/form/FormSelect.component"
import FormCheck from "@components/form/FormCheck.component"
import FormDatepicker from "@components/form/FormDatepicker.component"
import { formatDate } from "@utils/date"

export default function NewsPostCategoryNew() {
	const { data: settingGeneralData } = useGetData(`/setting-general`)
	const schema = settingGeneralData?.data?.text?.language === `id` ? yup.object({
		pl_title: yup.object({
			id: yup.string().required(`Title (ID) is required`)
		}),
		post_category_name: yup.string().required(`Category is required`)
	}) : yup.object({
		pl_title: yup.object({
			en: yup.string().required(`Title (EN) is required`)
		}),
		post_category_name: yup.string().required(`Category is required`)
	})
	const { breadcrumb } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)

	const setForm = useForm<any>({
		defaultValues: {
			post_status: false,
			pl_title: {
				en: ``,
				id: ``
			},
			post_image: ``,
			post_thumbnail: ``,
			pl_excerpt: {
				en: ``,
				id: ``
			},
			pl_content: {
				en: ``,
				id: ``
			},
			post_category_name: ``
		},
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: postCategory } = useGetData(`/post-category`)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			const postCatId = postCategory.data.find((item) => item.post_cat_name === data.post_category_name)
			delete data.post_category_name
			await postData(`/post/create`, {
				...data,
				post_status: data.post_status === true ? 1 : 2,
				post__post_cat_id: postCatId.post_cat_id,
				post_publish_at: formatDate(data.post_publish_at, `YYYY-MM-DD HH:mm`),
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

	useEffect(() => {
		reset({
			post_publish_at: new Date()
		})
	}, [])

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					legend="news"
					title="Add Post"
					parent={<><Link href={breadcrumb[1]}>Posts</Link></>}
					action={
						<Access
							auth="write:news-post-category"
							yes={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small">Add Post</button>
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
										<FormFile setForm={setForm} name="post_image" type="image" label="Post image" size="large" aspectRatio="7/4" footnote="Recommended size 1729x976px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 1729x976px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
									</div>
									<div className="row">
										<FormFile setForm={setForm} name="post_thumbnail" type="image" label="Thumbnail image" size="medium" aspectRatio="5/4" footnote="Recommended size 1240x930px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 1240x930px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
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
									{ /* <TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pl_excerpt.en" label="Excerpt (EN)" error={errors.pl_excerpt?.en} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pl_excerpt.id" label="Excerpt (ID)" error={errors.pl_excerpt?.id} />
													</div>
												)
											}
										]}
									/> */ }
									<TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormWysiwyg setForm={setForm} name="pl_content.en" label="Content (EN)" error={errors.pl_content?.en} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwyg setForm={setForm} name="pl_content.id" label="Content (ID)" error={errors.pl_content?.id} />
													</div>
												)
											}
										]}
									/>
									<div className="row">
										<FormSelect setForm={setForm} name="post_category_name" options={postCategory?.data?.map((item) => ({ value: String(item.post_cat_name), label: item.post_cat_name }))} label="Post category" error={errors?.post_category_name} />
									</div>
									<div className="row">
										<FormDatepicker setForm={setForm} name="post_publish_at" valueType="string" dateFormat="yyyy-MM-dd HH:mm" />
									</div>
									{ /* <div className="row">
											<FormSelect setForm={setForm} name="post_tags" options={[]} label="Tags" isMulti />
										</div> */ }
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
			{ page }
		</Dashboard>
	)
}