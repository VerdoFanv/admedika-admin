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
import FormCheck from "@components/form/FormCheck.component"
import { useRouter } from "next/router"
import FormFile from "@components/form/FormFile.component"
import FormWysiwyg from "@components/form/FormWysiwyg.component"

export default function MerchantSingleNew() {
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
		defaultValues: {
			pl_title: {
				en: ``,
				id: ``
			},
			meta: {
				text: {
					content_title: {
						en: ``,
						id: ``
					},
					content_desc: {
						en: ``,
						id: ``
					},
					phone: ``,
					email: ``,
					address_title: {
						en: ``,
						id: ``
					},
					map: ``,
					address_detail: ``
				}
			},
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
				page_parent_id: categoryId,
				page_type: `merchant-single`,
				page_status: data.page_status === true ? 1 : 2,
				page_domain: `mymerchant`
			})
			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Single has been added!`
			} })
			reset()
		} catch (err) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, single cannot be added!`
			} })
		}

		dispatch({ type: `set_isLoading`, payload: false })
	}

	if (!pageData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="Add Single"
					legend="merchant"
					parent={<><Link href={breadcrumb[0]}>Category</Link> / <Link href={breadcrumb[1]}>{pageData?.data?.page_title}</Link></>}
					action={
						<Access
							auth="write:merchant-mymerchant"
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
						<div className="admin-section-head">
							<h2 className="title">General</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormFile
											setForm={setForm}
											type="image"
											name="meta.image.merchant_logo"
											size="medium"
											aspectRatio="10/6"
											title="Recommended size 400x180px. Max filesize 3MB. Accepted format: jpg, png."
											footnote="Recommended size 400x180px. Max filesize 3MB. Accepted format: jpg, png."
										/>
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
									<TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="meta.text.content_title.en" label="Content Title (EN)"/>
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="meta.text.content_title.id" label="Content Title (ID)" />
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
														<FormWysiwyg setForm={setForm} name="meta.text.content_desc.en" label="Content Description (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwyg setForm={setForm} name="meta.text.content_desc.id" label="Content Description (ID)" />
													</div>
												)
											}
										]}
									/>
									<div className="row">
										<FormCheck setForm={setForm} name="page_status" label="Active" type="checkbox"/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Contact</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormInput setForm={setForm} name="meta.text.phone" label="Phone" placeholder="e.g +6221 2854 1515" />
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="meta.text.email" label="Email" placeholder="e.g email@gmail.com" />
									</div>
									<div className="row">
										<TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="meta.text.address_title.en" label="Address Title (EN)" />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="meta.text.address_title.id" label="Address Title (ID)" />
														</div>
													)
												}
											]}
										/>
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="meta.text.map" label="Map URL" />
									</div>
									<div className="row">
										<FormWysiwyg setForm={setForm} name="meta.text.address_detail" label="Detail Address" />
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

MerchantSingleNew.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}