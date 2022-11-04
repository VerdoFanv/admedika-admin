import dayjs from 'dayjs'
import LocalizeFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(LocalizeFormat)

export function formatDate(date, token = `yyyy-mm-dd`) {
	return dayjs(date).format(token)
}

export function parseDate(date) {
	return dayjs(date).toDate()
}

