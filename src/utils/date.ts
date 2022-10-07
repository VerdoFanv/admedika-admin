// import { format, parse } from "date-fns"
// import { id } from 'date-fns/locale'
import dayjs from 'dayjs'
import LocalizeFormat from 'dayjs/plugin/localizedFormat'
import Id from 'dayjs/locale/id'

dayjs.locale(Id)
dayjs.extend(LocalizeFormat)

export function formatDate(date, token = `yyyy-mm-dd`) {
	// if (!date) return
	// if (typeof date === `number`) {
	// 	return format(new Date(date * 1000), token, {
	// 		locale: id
	// 	})
	// } else {
	// 	return format(new Date(date), token, {
	// 		locale: id
	// 	})
	// }

	return dayjs(date).format(token)
}

export function parseDate(date) {
	// if (!date) return
	// return parse(date, token, new Date())

	return dayjs(date).toDate()
}

