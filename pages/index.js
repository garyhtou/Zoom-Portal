import Head from 'next/head';
import { useEffect, useState } from 'react';
import socket from './../utils/socketio';
import {
	Container,
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
	Spinner,
	Grid,
	GridItem,
	Link,
} from '@chakra-ui/react';
import One from '../components/one';
import moment from 'moment';
import isMobile from 'is-mobile';

export default function Home() {
	const [calls, setCalls] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		socket.on('connect', () => {
			console.log(`SOCKET CONNECTED: ${socket.id}`);
		});

		socket.on('ongoing-calls', (calls) => {
			setCalls(calls);
			if (loading) {
				setLoading(false);
			}
			console.log('ONGOING CALLS', calls);
		});
	}, []);

	return (
		<>
			<Head>
				<link
					href='https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap'
					rel='stylesheet'
				/>
			</Head>

			<Container maxW={'3xl'}>
				<Stack
					as={Box}
					textAlign={'center'}
					spacing={{ base: 8, md: 14 }}
					py={{ base: 20, md: 36 }}
				>
					<Heading
						fontWeight={600}
						fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
						lineHeight={'110%'}
					>
						Gary Tou's
						<br />
						<Text as={'span'} color={'blue.400'}>
							Meetings
						</Text>
					</Heading>
					{/* <Text color={'gray.500'}>
            Monetize your content by charging your most loyal readers and reward
            them loyalty points. Give back to your loyal readers by granting
            them access to your pre-releases and sneak-peaks.
          </Text> */}

					<Text color={'gray.500'}>
						Welcome to the waiting room!
						{calls.length === 0 ? (
							<>
								<Text color={'gray.500'}>
									There are no available meetings at this moment.
								</Text>
							</>
						) : null}
					</Text>

					{/* show calls, if there are any */}
					<Grid templateColumns={'50% 50%'} gap={'5%'}>
						{calls.map((c, i, arr) => (
							<>
								<Call
									key={c.zoomId}
									call={c}
									colSpan={i == arr.length - 1 && arr.length % 2 == 1 ? 2 : 1}
								/>
							</>
						))}
					</Grid>
				</Stack>
			</Container>
		</>
	);
}

export function Call(props) {
	const c = props.call;
	const col = props.colSpan || 1;
	return (
		<GridItem colSpan={col}>
			<Box
				w={'full'}
				bg={useColorModeValue('white', 'gray.900')}
				boxShadow={'2xl'}
				rounded={'lg'}
				p={6}
				textAlign={'center'}
			>
				<Heading fontSize={'2xl'} fontFamily={'body'}>
					{c.name}
				</Heading>
				<Text fontWeight={600} color={'gray.500'} mb={4}>
					{moment(c.start, 'X').fromNow()}
				</Text>
				<Text
					textAlign={'center'}
					color={useColorModeValue('gray.700', 'gray.400')}
					px={3}
				>
					{c.description}
				</Text>

				<Stack mt={8} direction={'row'} spacing={4}>
					{/* <Button
								flex={1}
								fontSize={'sm'}
								rounded={'full'}
								_focus={{
									bg: 'gray.200',
								}}
							>
								Message
							</Button> */}
					<Link href={c.join[isMobile() ? 'mobile' : 'desktop']} width={'full'}>
						<Button
							flex={1}
							fontSize={'sm'}
							rounded={'full'}
							bg={'blue.400'}
							color={'white'}
							boxShadow={
								'0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
							}
							_hover={{
								bg: 'blue.500',
							}}
							_focus={{
								bg: 'blue.500',
							}}
							width={'full'}
						>
							Join
						</Button>
					</Link>
				</Stack>
			</Box>
		</GridItem>
	);
}
