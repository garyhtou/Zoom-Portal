import {
	Stack,
	Flex,
	Box,
	Heading,
	Text,
	Button,
	Image,
	Icon,
	IconButton,
	createIcon,
	IconProps,
	useColorModeValue,
	Avatar,
} from '@chakra-ui/react';
import Photo from './photo';

export default function One(props) {
	const call = props.calls[0];

	return (
		<Stack
			align={'center'}
			spacing={{ base: 8, md: 10 }}
			py={{ base: 20, md: 28 }}
			px={{ base: 0, md: 20 }}
			direction={{ base: 'column', md: 'row' }}
		>
			<Stack flex={1} spacing={{ base: 5, md: 10 }}>
				<Heading
					lineHeight={1.1}
					fontWeight={600}
					fontSize={{ base: '5xl', sm: '6xl', md: '5xl', lg: '6xl' }}
				>
					<Text
						as={'span'}
						position={'relative'}
						_after={{
							content: "''",
							width: 'full',
							height: '30%',
							position: 'absolute',
							bottom: 1,
							left: 0,
							bg: 'purple.100',
							zIndex: -1,
						}}
					>
						{call.defaultName ? "Gary Tou's" : "Gary Tou's Zoom"}
					</Text>
					<br />
					<Text as={'span'} color={'purple.600'}>
						{call.defaultName ? 'Zoom Meeting' : call.name}
					</Text>
				</Heading>
				{call.description !== '' ? (
					<Text color={'gray.500'}>{call.description}</Text>
				) : null}
				<Stack
					spacing={{ base: 4, sm: 6 }}
					direction={{ base: 'column', sm: 'row' }}
				>
					<Button
						rounded={'full'}
						size={'lg'}
						fontWeight={'normal'}
						px={6}
						colorScheme={'blue'}
						bg={'blue.400'}
						_hover={{ bg: 'blue.500' }}
					>
						Join Zoom
					</Button>
					<Button rounded={'full'} size={'lg'} fontWeight={'normal'} px={6}>
						How It Works
					</Button>
				</Stack>
			</Stack>
			<Photo />
		</Stack>
	);
}
