import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
	styles: {
		global: {
			html: {
				minHeight: '100vh;',
			},
			body: {
				minHeight: '100vh;',
			},
			'#__next': {
				minHeight: '100vh;',
			},
		},
	},
});

export default theme;
