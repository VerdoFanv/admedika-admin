import AdminHeader from '@components/admin/AdminHeader.component'
import Dashboard from '@components/dashboard/Dashboard.component'
import EiExpandable from '@components/ei/EiExpandable.component'
import FormFile from "@components/form/FormFile.component"
import FormInput from '@components/form/FormInput.component'
import FormRepeater from "@components/form/FormRepeater.component"
import FormTextarea from '@components/form/FormTextarea.component'
import FormCheck from "@components/form/FormCheck.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { postData } from '@utils/fetcher'
import IconEmail from 'public/assets/icons/icon-envelope.svg'
import IconPhone from 'public/assets/icons/icon-phone.svg'
import { useContext, useEffect } from "react"
import { useForm } from 'react-hook-form'
import TabsNavigation from '@components/util/Tabs.component'
import FormWysiwygColorPickerOnly from '@components/form/FormWysiwygColorPickerOnly.component'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSWRConfig } from 'swr'
import FormSelect from '@components/form/FormSelect.component'

const schema = yup.object({
	text: yup.object({
		session_login: yup.number(),
		service_download_email: yup.string().email(),
		service_inquiry_email: yup.string().email()
	})
})

type HTMLOptionsSelectProps = {
	value: string
	label: string
}
export default function SettingGeneral() {
	const { dispatch } = useContext(DashboardContext)
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/setting-general`)
	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm

	const socialMediaOptionsType: HTMLOptionsSelectProps[] = [
		{ value: `sosmed`, label: `Social Media` },
		{ value: `mail`, label: `Email` }
	]
	const languageOptions: HTMLOptionsSelectProps[] = [
		{ value: `id`, label: `Indonesia (ID)` },
		{ value: `en`, label: `English (EN)` }
	]
	const { mutate } = useSWRConfig()

	useLoading(pageIsLoading)

	async function onSubmit(data: any) {
		dispatch({ type: `set_isLoading`, payload: true })
		const body = {
			...data,
			text: {
				...data.text,
				force_webp: data.text.force_webp ? `1` : `0`,
				enable_multilang: data.text.enable_multilang ? `1` : `0`
			}
		}

		try {
			await postData(`/setting-general/update`, body)
			await mutate(`${process.env.NEXT_PUBLIC_API_URL}/setting-general`)
			dispatch({ type: `show_notification`, payload: {
				text: `Page has been updated!`,
				type: `success`
			} })
		} catch (e) {
			dispatch({ type: `show_notification`, payload: {
				text: `Sorry, Page cannot be updated!`,
				type: `error`
			} })
		}

		dispatch({ type: `set_isLoading`, payload: false })
	}

	useEffect(() => {
		if (pageData) {
			reset({
				...pageData.data,
				text: {
					...pageData.data.text,
					force_webp: pageData.data.text.force_webp === `1` ? true : false,
					enable_multilang: pageData.data.text.enable_multilang === `1` ? true : false
				}
			})
		}
	}, [ reset, pageData ])

	if (!pageData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="General"
					legend="Settings"
					action={
						<Access
							auth="write:settings-general"
							yes={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small">Save Settings</button>
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
							<h2 className="title">Website Settings</h2>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<EiExpandable title="Site Meta Data" desc="Content for search engines">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="multilang.meta_title.en" label="Meta Title (EN)" footnote={<span>Recommended: <strong>70</strong> characters.</span>} />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="multilang.meta_title.id" label="Meta Title (ID)" footnote={<span>Recommended: <strong>70</strong> characters.</span>} />
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
															<FormTextarea setForm={setForm} name="multilang.meta_description.en" label="Meta Description (EN)" footnote={<span>Recommended: <strong>156</strong> characters.</span>} />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormTextarea setForm={setForm} name="multilang.meta_description.id" label="Meta Description (ID)" footnote={<span>Recommended: <strong>156</strong> characters.</span>} />
														</div>
													)
												}
											]}
										/>
									</div>
								</div>
							</EiExpandable>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<EiExpandable title="Email Addresses" desc="Email addresses of your website">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<div className="row">
											<FormInput setForm={setForm} name="text.contact_email" label="Contact Email" icon={IconEmail} footnote="Email for contact form. Add multiple email separated by a comma." />
										</div>
									</div>
								</div>
							</EiExpandable>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<EiExpandable title="Site Header" desc="Config of your website's header">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<div className="row">
											<FormFile setForm={setForm} styleBackgroundColor="white" name="image.header_logo" type="image" label="Logo Black" size="medium" aspectRatio="2/1" footnote="Max filesize 1MB. Accepted format: jpg, png, svg." acceptedFormat={[ `.jpg`, `.png`, `.svg` ]} />
										</div>
										<div className="row">
											<FormFile setForm={setForm} styleBackgroundColor="black" name="image.header_logo_white" type="image" label="Logo White" size="medium" aspectRatio="2/1" footnote="Max filesize 1MB. Accepted format: jpg, png, svg." acceptedFormat={[ `.jpg`, `.png`, `.svg` ]} />
										</div>
									</div>
								</div>
							</EiExpandable>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<EiExpandable title="Site Footer" desc="Config of your website's footer">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<div className="row">
											<FormFile setForm={setForm} styleBackgroundColor="white" name="image.footer_logo" type="image" label="Footer logo" size="medium" aspectRatio="2/1" footnote="Max filesize 1MB. Accepted format: jpg, png, svg." acceptedFormat={[ `.jpg`, `.png`, `.svg` ]} />
										</div>
									</div>
								</div>
							</EiExpandable>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Integration Settings</h2>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<EiExpandable title="3rd Party Service" desc="Configuration for 3rd party integrations">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<div className="row">
											<FormInput setForm={setForm} name="text.google_analytics_tracking_id" footnote="Google Analytics Tracking ID" placeholder="UA-XXXXXXXXX-XX" />
										</div>
									</div>
								</div>
							</EiExpandable>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<EiExpandable title="Social Media" desc="Link to your social media accounts">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<div className="row">
											<FormRepeater
												setForm={setForm}
												name="repeater.social_media"
												inputNames={[ `icon`, `type`, `url` ]}
												inputTypes={[ `image`, `select`, `text` ]}
												inputLabels={[ `Icon`, `Type`, `URL` ]}
												inputWidths={[ `48px`, `auto`, `auto` ]}
												inputProps={[
													{
														size: `icon`,
														title: `Recommended size 65x65px. Max filesize 500kb. Accepted format: png, svg.`,
														footnote: `Recommended size 65x65px. Max filesize 500kb. Accepted format: png, svg.`,
														styleNoPlaceholder: true,
														styleNoButton: true
													},
													{
														placeholder: `Type`,
														options: socialMediaOptionsType,
													},
													{
														placeholder: `URL`
													}
												]}
												max={100}
												sortable
											/>
										</div>
									</div>
								</div>
							</EiExpandable>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<EiExpandable title="Partners" desc="Partners in footer of your website">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<div className="row">
											<FormRepeater
												setForm={setForm}
												name="repeater.partner"
												inputNames={[ `image` ]}
												inputTypes={[ `image` ]}
												inputLabels={[ `Image` ]}
												inputWidths={[ `auto` ]}
												inputProps={[
													{
														size: `medium`,
														title: `Max filesize 2MB. Accepted format: png, svg.`,
														footnote: `Max filesize 2MB. Accepted format: png, svg.`,
													}
												]}
												max={100}
												sortable
											/>
										</div>
									</div>
								</div>
							</EiExpandable>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Popup</h2>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<EiExpandable title="Popup Complaint">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<div className="row">
											<FormInput setForm={setForm} name="text.complaint_email" label="Email" />
										</div>
										<TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="multilang.popup_complaint_title.en" label="Title (EN)" />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="multilang.popup_complaint_title.id" label="Title (ID)" />
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
															<FormTextarea setForm={setForm} name="multilang.popup_complaint_message.en" label="Message (EN)" />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormTextarea setForm={setForm} name="multilang.popup_complaint_message.id" label="Message (ID)" />
														</div>
													)
												}
											]}
										/>
									</div>
								</div>
							</EiExpandable>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Contact Settings</h2>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<EiExpandable title="Contact Info" desc="Contact Info of your website">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<div className="row">
											<FormWysiwygColorPickerOnly setForm={setForm} name="text.company" label="Title" />
										</div>
										<div className="row">
											<FormWysiwygColorPickerOnly setForm={setForm} name="text.address" label="Address" />
										</div>
										<div className="row">
											<FormInput setForm={setForm} name="text.phone_1" label="Phone 1" icon={IconPhone} />
										</div>
										<div className="row">
											<FormInput setForm={setForm} name="text.phone_2" label="Phone 2" icon={IconPhone} />
										</div>
									</div>
								</div>
							</EiExpandable>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<EiExpandable title="Contact Popup">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<FormInput setForm={setForm} name="multilang.popup_contact_title.en" label="Popup Title (EN)" />
													)
												},
												{
													item: (
														<FormInput setForm={setForm} name="multilang.popup_contact_title.id" label="Popup Title (ID)" />
													)
												}
											]}
										/>
										<TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<FormTextarea setForm={setForm} name="multilang.popup_contact_message.en" label="Popup Message (EN)" />
													)
												},
												{
													item: (
														<FormTextarea setForm={setForm} name="multilang.popup_contact_message.id" label="Popup Message (ID)" />
													)
												}
											]}
										/>
									</div>
								</div>
							</EiExpandable>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Service Page Settings</h2>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<EiExpandable title="Service download" desc="Service download for the service page on the website">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<div className="row">
											<FormInput setForm={setForm} name="text.service_download_email" label="Email Receiver" icon={IconEmail} error={errors?.text?.service_download_email} footnote="Add multiple email separated by a comma." />
										</div>
										<TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="multilang.popup_download_title.en" label="Popup download title (EN)" />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="multilang.popup_download_title.id" label="Popup download title (ID)" />
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
															<FormTextarea setForm={setForm} name="multilang.popup_download_message.en" label="Popup download message (EN)" />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormTextarea setForm={setForm} name="multilang.popup_download_message.id" label="Popup download message (ID)" />
														</div>
													)
												}
											]}
										/>
									</div>
								</div>
							</EiExpandable>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<EiExpandable title="Service inquiry" desc="Service inquiry for the service page on the website">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<div className="row">
											<FormInput setForm={setForm} name="text.service_inquiry_email" label="Email Receiver" icon={IconEmail} error={errors?.text?.service_inquiry_email} footnote="Add multiple email separated by a comma." />
										</div>
										<TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="multilang.popup_inquiry_title.en" label="Popup inquiry title (EN)" />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="multilang.popup_inquiry_title.id" label="Popup inquiry title (ID)" />
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
															<FormTextarea setForm={setForm} name="multilang.popup_inquiry_message.en" label="Popup inquiry message (EN)" />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormTextarea setForm={setForm} name="multilang.popup_inquiry_message.id" label="Popup inquiry message (ID)" />
														</div>
													)
												}
											]}
										/>
									</div>
								</div>
							</EiExpandable>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Career Page Settings</h2>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormInput setForm={setForm} name="text.career_email" label="Email Receiver" icon={IconEmail} footnote="Add multiple email separated by a comma." />
									</div>
									<EiExpandable title="Career Popup">
										<div className="form-fieldset">
											<div className="form-fieldset-body">
												<TabsNavigation
													listLabel={[ `EN`, `ID` ]}
													content={[
														{
															item: (
																<FormInput setForm={setForm} name="multilang.popup_career_title.en" label="Popup Title (EN)" />
															)
														},
														{
															item: (
																<FormInput setForm={setForm} name="multilang.popup_career_title.id" label="Popup Title (ID)" />
															)
														}
													]}
												/>
												<TabsNavigation
													listLabel={[ `EN`, `ID` ]}
													content={[
														{
															item: (
																<FormTextarea setForm={setForm} name="multilang.popup_career_message.en" label="Popup Message (EN)" />
															)
														},
														{
															item: (
																<FormTextarea setForm={setForm} name="multilang.popup_career_message.id" label="Popup Message (ID)" />
															)
														}
													]}
												/>
											</div>
										</div>
									</EiExpandable>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Multi Language Settings</h2>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormSelect
											setForm={setForm}
											options={languageOptions}
											label="Default Language"
											name="text.language"
										/>
									</div>
									<div className="row">
										<FormCheck setForm={setForm} type="checkbox" name="text.enable_multilang" label="Multi Language" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Others Settings</h2>
						</div>
						<div className="admin-section-body admin-section-body-graydient">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormInput setForm={setForm} label="Session Login Time In (Hours)" name="text.session_login" error={errors?.text?.session_login} />
									</div>
									<div className="row">
										<FormCheck setForm={setForm} type="checkbox" name="text.force_webp" label="Force Webp" />
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

SettingGeneral.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{ page }
		</Dashboard>
	)
}