import Document, { Head, Html, Main, NextScript } from 'next/document'
class EiDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;600;700&display=optional" rel="stylesheet" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default EiDocument
