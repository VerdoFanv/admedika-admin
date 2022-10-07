import { ScopedMutator } from "swr/dist/types"
import { findCookieName } from '@utils/cookie'

const initHeaders = () => {
	const headers = new Headers()
	headers.append(`Accept`, `application/json`)

	if (process.env.NEXT_PUBLIC_APIKEY) {
		headers.append(`apikey`, process.env.NEXT_PUBLIC_APIKEY)
	}
	if (typeof window !== `undefined`) {
		const accToken = localStorage.getItem(`accessToken`)
		const isLogin = findCookieName(`isLogin`)

		if (accToken && isLogin) {
			headers.append(`Authorization`, `Bearer ${accToken}`)
		}
	}

	return headers
}

type FetchAPIProp = {
	url: string
	body?: any
	method?: string
	headers?: Headers
}

const fetchAPI = async ({ url, body, method = `GET`, headers }: FetchAPIProp) => {
	return fetch(url, {
		method,
		headers,
		body
	})
}

export const fetcherPost = async (url: string, body?: any) => {
	const response = await fetchAPI({
		url,
		method: `POST`,
		headers: initHeaders(),
		body
	})

	try {
		const responseJSON = await response.json()
		return responseJSON
	} catch (error) {
		throw new Error(error.message)
	}
}

export const fetcherGet = async (url) => {
	const response = await fetchAPI({
		url,
		headers: initHeaders()
	})

	try {
		const responseJSON = await response.json()
		return responseJSON
	} catch (error) {
		throw new Error(error.message)
	}
}

export function buildFormData(formData: FormData, data: any, parentKey?: string) {
	if (data && typeof data === `object` && !(data instanceof Date) && !(data instanceof File)) {
		Object.keys(data).forEach(key => {
			buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
		})
	} else {
		const value = data == null ? `` : data
		formData.append(parentKey, value)
	}
}

export async function postData(url: string, data: any) {
	const formData = new FormData()
	if (data !== ``) {
		buildFormData(formData, data)

		// FOR CHECKING FORMDATA VALUES
		// for (var value of formData.values()) {
		// 	console.log(value)
		// }

		const response = await fetcherPost(`${process.env.NEXT_PUBLIC_API_URL}${url}`, formData)

		if (response.status === false) {
			throw new Error(response.message)
		}

		return response
	} else {
		throw new Error(`No data being submitted.`)
	}
}

export async function postOptimisticData(postPath: string, updateData: any, mutate: ScopedMutator<any>, getPath: string, optimisticData: any) {
	mutate(`${process.env.NEXT_PUBLIC_API_URL}${getPath}`, await postData(postPath, updateData), {
		optimisticData,
		rollbackOnError: true
	})
}

export async function postWithoutInOptimisticData(postPath: string, updateData: any, mutate: ScopedMutator<any>, getPath: string, optimisticData: any) {
	await postData(postPath, updateData)
	mutate(`${process.env.NEXT_PUBLIC_API_URL}${getPath}`, optimisticData, {
		optimisticData,
		rollbackOnError: true,
		revalidate: true
	})
}

export async function deleteOptimisticData(deletePath: string, mutate: ScopedMutator<any>, getPath: string, optimisticData: any) {
	await deleteData(deletePath)
	mutate(`${process.env.NEXT_PUBLIC_API_URL}${getPath}`, optimisticData, {
		optimisticData,
		rollbackOnError: true,
	})
}

export async function deleteData(path: string) {
	const response = await fetcherPost(`${process.env.NEXT_PUBLIC_API_URL}${path}`)

	if (response.status === false) {
		throw new Error(response.message)
	}

	return response
}