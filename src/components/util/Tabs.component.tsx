import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { slidedownMotion } from '@variables/motion.variable'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactElement } from 'react'
import useGetData from '@hooks/useGetData.hook'

interface ContentElem {
	item: ReactElement
}

interface Props {
  listLabel: string[]
  content: ContentElem[]
}

export default function TabsNavigation({ listLabel, content }: Props) {
	const { data: settingGeneral } = useGetData(`/setting-general`)

	if (!settingGeneral?.data) {
		return <></>
	}

	return (
		<Tabs>
			<TabList>
				{listLabel.includes(`ID` && `EN`) ? (
					settingGeneral?.data?.text?.enable_multilang === `1` ? listLabel[0].toLowerCase() === settingGeneral?.data?.text?.language ? listLabel.map((item, i) => (
						<Tab key={i + 1}>{item}</Tab>
					)) : listLabel.map((item, i) => (
						<Tab key={i + 1}>{item}</Tab>
					)).reverse() : listLabel.filter((item) => item.toLowerCase() === settingGeneral?.data?.text?.language).map((item, i) => <Tab key={i + 1}>{item}</Tab>)
				) : (
					listLabel.map((item, i) => (
						<Tab key={i + 1}>{item}</Tab>
					))
				)
				}
			</TabList>

			{listLabel.includes(`ID` || `EN`) ? (
				settingGeneral?.data?.text?.enable_multilang === `1` ? listLabel[0].toLowerCase() === settingGeneral?.data?.text?.language ? content.map((item, i) => (
					<TabPanel key={i}>
						<AnimatePresence>
							<motion.div
								variants={slidedownMotion}
								initial="hidden"
								animate="visible"
								exit="hidden"
							>
								{item.item}
							</motion.div>
						</AnimatePresence>
					</TabPanel>
				)) : content.map((item, i) => (
					<TabPanel key={i}>
						<AnimatePresence>
							<motion.div
								variants={slidedownMotion}
								initial="hidden"
								animate="visible"
								exit="hidden"
							>
								{item.item}
							</motion.div>
						</AnimatePresence>
					</TabPanel>
				)).reverse() : settingGeneral?.data?.text?.language === `en` ? [ content[0] ].map((item, i) => (
					<TabPanel key={i}>
						<AnimatePresence>
							<motion.div
								variants={slidedownMotion}
								initial="hidden"
								animate="visible"
								exit="hidden"
							>
								{item.item}
							</motion.div>
						</AnimatePresence>
					</TabPanel>
				)) : [ content[1] ].map((item, i) => (
					<TabPanel key={i}>
						<AnimatePresence>
							<motion.div
								variants={slidedownMotion}
								initial="hidden"
								animate="visible"
								exit="hidden"
							>
								{item.item}
							</motion.div>
						</AnimatePresence>
					</TabPanel>
				))
			) : (
				content.map((item, i) => (
					<TabPanel key={i}>
						<AnimatePresence>
							<motion.div
								variants={slidedownMotion}
								initial="hidden"
								animate="visible"
								exit="hidden"
							>
								{item.item}
							</motion.div>
						</AnimatePresence>
					</TabPanel>
				))
			)}
		</Tabs>
	)
}
