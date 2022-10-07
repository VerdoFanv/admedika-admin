import FormCheck from "@components/form/FormCheck.component"
import FormInput from "@components/form/FormInput.component"
import FormTextarea from "@components/form/FormTextarea.component"
import IconSidebarOpen from 'public/assets/icons/icon-sidebar-open.svg'
import { UseFormReturn, FieldValues } from 'react-hook-form'

interface Props {
	setForm: UseFormReturn<FieldValues, any>
	isShown: boolean
	close: () => void
}

export default function AdminPageSidebar({ setForm, isShown, close }: Props) {
	return (
		<>
			{isShown &&
			<aside className="admin-page-sidebar">
				<div className="admin-sidebar">
					<div className="admin-sidebar-head">
						<h4 className="heading">Page Settings</h4>
						<ul className="actions">
							<li className="action">
								<button type="button" onClick={close} className="button button-gray button-small"><i className="icon icon-medium icon-only" role="img"><IconSidebarOpen className="svg" /></i></button>
							</li>
						</ul>
					</div>
					<div className="admin-sidebar-body">
						<div className="form-fieldset">
							<div className="form-fieldset-body">
								<div className="row">
									<FormCheck setForm={setForm} type="checkbox" name="page_status" label="Publish" />
								</div>
								<div className="row">
									<FormInput setForm={setForm} name="page_url" label="Page URL" footnote="URL cannot be changed" readOnly />
								</div>
								<div className="row">
									<FormInput setForm={setForm} name="pl_seo_title.id" label="Meta title (ID)" />
								</div>
								<div className="row">
									<FormInput setForm={setForm} name="pl_seo_title.en" label="Meta title (EN)" />
								</div>
								<div className="row">
									<FormInput setForm={setForm} name="pl_seo_keywords.id" label="Meta keyword (ID)" />
								</div>
								<div className="row">
									<FormInput setForm={setForm} name="pl_seo_keywords.en" label="Meta keyword (EN)" />
								</div>
								<div className="row">
									<FormTextarea setForm={setForm} name="pl_seo_descriptions.id" label="Meta description (ID)" />
								</div>
								<div className="row">
									<FormTextarea setForm={setForm} name="pl_seo_descriptions.en" label="Meta description (EN)" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</aside>
			}
		</>
	)
}