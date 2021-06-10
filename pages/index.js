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
} from '@chakra-ui/react';
import One from '../components/one';
import moment from 'moment';

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
							Zoom Meetings
						</Text>
					</Heading>
					{/* <Text color={'gray.500'}>
            Monetize your content by charging your most loyal readers and reward
            them loyalty points. Give back to your loyal readers by granting
            them access to your pre-releases and sneak-peaks.
          </Text> */}

					{loading ? (
						<p>loading</p>
					) : calls.length === 0 ? (
						<p>none</p>
					) : (
						<>
							{calls.map((c) => (
								<Box
									maxW={'320px'}
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
										>
											Join
										</Button>
									</Stack>
								</Box>
							))}
						</>
					)}
				</Stack>
			</Container>
		</>
	);
}
