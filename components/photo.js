import {
	Stack,
	Box,
	Text,
	Image,
	Icon,
	useColorModeValue,
	Avatar,
	Button,
	Link,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const UNSPLASH_USER_PROFILE = 'https://unsplash.com/@garyhtou';
const API_ENDPOINT =
	'https://api.garytou.com/v1/unsplash/collection/zoom-portal/random';

export default function Photo() {
	const [photo, setPhoto] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(async () => {
		// const response = await (await axios.get(API_ENDPOINT)).data;
		// setPhoto(response);
		setPhoto({
			id: 'wFMmYHhWek4',
			createdAt: '2019-04-19T06:03:04-04:00',
			width: 6000,
			height: 4000,
			color: '#262626',
			blurHash: 'L[HoUgM|xuWB_4RkfkaztSofM{of',
			description: null,
			altDescription: 'wood logs filed up on road side near hill',
			urls: {
				raw: 'https://images.unsplash.com/photo-1555667880-32ed1a4fdb19?ixid=MnwyMjc4MTl8MHwxfGNvbGxlY3Rpb258MnxzVVY0ZzB0OVhqZ3x8fHx8Mnx8MTYyMjAwNzE1Mw&ixlib=rb-1.2.1',
				full: 'https://images.unsplash.com/photo-1555667880-32ed1a4fdb19?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMjc4MTl8MHwxfGNvbGxlY3Rpb258MnxzVVY0ZzB0OVhqZ3x8fHx8Mnx8MTYyMjAwNzE1Mw&ixlib=rb-1.2.1&q=85',
				small:
					'https://images.unsplash.com/photo-1555667880-32ed1a4fdb19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjc4MTl8MHwxfGNvbGxlY3Rpb258MnxzVVY0ZzB0OVhqZ3x8fHx8Mnx8MTYyMjAwNzE1Mw&ixlib=rb-1.2.1&q=80&w=400',
				thumb:
					'https://images.unsplash.com/photo-1555667880-32ed1a4fdb19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjc4MTl8MHwxfGNvbGxlY3Rpb258MnxzVVY0ZzB0OVhqZ3x8fHx8Mnx8MTYyMjAwNzE1Mw&ixlib=rb-1.2.1&q=80&w=200',
			},
			links: {
				api: 'https://api.unsplash.com/photos/wFMmYHhWek4',
				html: 'https://unsplash.com/photos/wFMmYHhWek4',
				download: 'https://unsplash.com/photos/wFMmYHhWek4/download',
				downloadLocation:
					'https://api.unsplash.com/photos/wFMmYHhWek4/download?ixid=MnwyMjc4MTl8MHwxfGNvbGxlY3Rpb258MnxzVVY0ZzB0OVhqZ3x8fHx8Mnx8MTYyMjAwNzE1Mw',
			},
			user: {
				id: 'a4wrGnuSZhk',
				username: 'garyhtou',
				name: 'Gary Tou',
				firstName: 'Gary',
				lastName: 'Tou',
				twitterUsername: 'garyhtou',
				bio: 'Photographer and Software Developer in development',
				location: 'Seattle, WA',
				links: {
					api: 'https://api.unsplash.com/users/garyhtou',
					html: 'https://unsplash.com/@garyhtou',
				},
				profileImage: {
					small:
						'https://images.unsplash.com/profile-1586060793364-e081bd08f878image?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32',
					medium:
						'https://images.unsplash.com/profile-1586060793364-e081bd08f878image?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64',
					large:
						'https://images.unsplash.com/profile-1586060793364-e081bd08f878image?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128',
				},
				instagramUsername: 'garyhtou',
			},
			stats: { downloads: 180, views: 43456, likes: 0 },
		});
		setLoading(false);
	}, []);
	return (
		<Stack
			flex={1}
			justify={'center'}
			align={'start'}
			position={'relative'}
			w={'full'}
		>
			<Blob
				w={'150%'}
				h={'150%'}
				position={'absolute'}
				top={'-20%'}
				left={0}
				zIndex={-1}
				color={useColorModeValue('blue.50', 'blue.400')}
			/>
			<Box
				position={'relative'}
				height={'300px'}
				rounded={'2xl'}
				boxShadow={'2xl'}
				width={'full'}
				overflow={'hidden'}
			>
				<Box
					_hover={{ bg: 'transparent' }}
					color={'white'}
					position={'absolute'}
					left={2}
					bottom={2}
				>
					<Stack
						spacing={3}
						direction={'row'}
						alignItems={'flex-end'}
						rounded={'full'}
						bg={'blackAlpha.600'}
						p={1}
						pr={5}
					>
						<Link href={UNSPLASH_USER_PROFILE} target={'_blank'}>
							<Avatar
								name='Gary Tou'
								src='https://assets.garytou.com/profile/GaryTou.jpg'
							/>
						</Link>
						<Stack
							spacing={0}
							direction={'column'}
							justifyContent={'flex-end'}
							alignItems={'flex-start'}
						>
							<Text>Check out this photo I took!</Text>
							{/* <Text>
								Photo by{' '}
								<a
									href="https://unsplash.com/@garyhtou?utm_source=Gary Tou's Website&utm_medium=referral"
									style={{ textDecoration: 'underline' }}
								>
									Gary Tou
								</a>{' '}
								on{' '}
								<a
									href="https://unsplash.com/?utm_source=Gary Tou's Website&utm_medium=referral"
									style={{ textDecoration: 'underline' }}
								>
									Unsplash
								</a>
							</Text> */}
							<Text fontSize={'small'}>
								{loading ? '--' : photo.stats.views} views •{' '}
								{loading ? '--' : photo.stats.downloads} downloads
							</Text>
						</Stack>
					</Stack>
				</Box>
				<Link
					href={loading ? 'https://unsplash.com' : photo.links.html}
					target={'_blank'}
				>
					<Image
						alt={loading ? 'Photo by Gary Tou' : photo.altDescription}
						fit={'cover'}
						align={'center'}
						w={'100%'}
						h={'100%'}
						src={
							loading
								? 'https://images.unsplash.com/photo-1555667880-32ed1a4fdb19?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMjc4MTl8MHwxfGNvbGxlY3Rpb258MnxzVVY0ZzB0OVhqZ3x8fHx8Mnx8MTYxOTk0NzAzNg&ixlib=rb-1.2.1&q=85'
								: photo.urls.small
						}
					/>
				</Link>
			</Box>
		</Stack>
	);
}

const Blob = (props) => {
	return (
		<Icon
			width={'100%'}
			viewBox='0 0 578 440'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z'
				fill='currentColor'
			/>
		</Icon>
	);
};
