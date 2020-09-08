import React from "react";
import firebase from "./../firebase";
import config from "./../config";
import {
	Layout,
	Avatar,
	Button,
	Form,
	Input,
	notification,
	List,
	Space,
} from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import Filter from "bad-words";
import moment from "moment";
const filter = new Filter();

class OpenMeeting extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			openMeetings: { meetings: {} },
			nameFeedback: false,
			nameValidate: "success",
			nameHelp: null,
			meetingTopicFeedback: false,
			meetingTopicValidate: "success",
			meetingTopicHelp: null,
			onGoing: true,
			onGoingMeeting: null,
			openZoomJoin: false,
			openZoomScheme: "",
			openZoomURL: "",
		};

		this.checkOnGoing = this.checkOnGoing.bind(this);
	}

	componentDidMount() {
		firebase
			.database()
			.ref("openMeetings")
			.on(
				"value",
				function (snapshot) {
					if (snapshot.exists()) {
						this.setState(
							{
								openMeetings: snapshot.val(),
								openZoomURL: snapshot.val().url,
								openZoomScheme: this.state.mobile
									? snapshot.val().mobileScheme
									: snapshot.val().desktopScheme,
							},
							this.checkOnGoing
						);
					}
				}.bind(this)
			);

		this.checkOnGoingInterval = setInterval(this.checkOnGoing, 15000);
	}

	componentWillUnmount() {
		this.checkOnGoingInterval && clearInterval(this.checkOnGoingInterval);
		this.checkOnGoingInterval = undefined;
	}

	checkOnGoing() {
		if (Object.keys(this.state.openMeetings.meetings).length !== 0) {
			const lastMeetingPushKey = Object.keys(this.state.openMeetings.meetings)[
				Object.keys(this.state.openMeetings.meetings).length - 1
			];
			const lastMeetingTime = this.state.openMeetings.meetings[
				lastMeetingPushKey
			].time;

			var lastMeetingJoinTime = null;
			if (
				typeof this.state.openMeetings.meetings[lastMeetingPushKey].joins !==
				"undefined"
			) {
				const lastMeetingJoinPushKey = Object.keys(
					this.state.openMeetings.meetings[lastMeetingPushKey].joins
				)[
					Object.keys(
						this.state.openMeetings.meetings[lastMeetingPushKey].joins
					).length - 1
				];

				lastMeetingJoinTime = this.state.openMeetings.meetings[
					lastMeetingPushKey
				].joins[lastMeetingJoinPushKey];
			} else {
				lastMeetingJoinTime = lastMeetingTime;
			}

			const lastUsed = moment(lastMeetingJoinTime, "x");
			const now = moment(new Date());
			const oneHour = moment(new Date()).subtract(1, "hours");
			if (lastUsed.isBetween(oneHour, now)) {
				this.setState({
					onGoing: true,
					onGoingMeeting: this.state.openMeetings.meetings[lastMeetingPushKey],
				});
			} else {
				this.setState({ onGoing: false, onGoingMeeting: null });
			}
		}
	}

	render() {
		return (
			<>
				<div>
					{this.state.onGoing ? (
						<>
							{this.state.onGoingMeeting !== null ? (
								<>
									<h1>{this.state.onGoingMeeting.topic}</h1>
									<Space>
										<Button
											type="primary"
											href={
												!this.state.openZoomJoin
													? this.state.openZoomScheme
													: this.state.openZoomURL
											}
											onClick={function () {
												if (!this.state.openZoomJoin) {
													this.logHomeJoin();
													setInterval(
														function () {
															this.setState({ openZoomJoin: true });
														}.bind(this),
														100
													);
												}
											}.bind(this)}
										>
											Join Zoom
										</Button>
										<span>
											Started {moment(this.state.onGoingMeeting.time).fromNow()}
										</span>
									</Space>
								</>
							) : (
								<></>
							)}
						</>
					) : (
						<>
							<h1>Start Meeting!</h1>
							<div>
								<Form
									hideRequiredMark
									onFinish={function (values) {
										console.log(values);

										var error = false;

										if (filter.isProfane(values.topic)) {
											notification.error({
												message: "Woah! Choose some different words",
												description: (
													<p>
														No profanity in your <code>name</code> please!
													</p>
												),
											});
											this.setState({
												meetingTopicFeedback: true,
												meetingTopicValidate: "error",
												meetingTopicHelp: "Woah! Choose some different words",
											});
											error = true;
										}
										if (filter.isProfane(values.name)) {
											notification.error({
												message: "Woah! Choose some different words",
												description: (
													<p>
														No profanity in your <code>meeting topic</code>{" "}
														please!
													</p>
												),
											});
											this.setState({
												nameFeedback: true,
												nameValidate: "error",
												nameHelp: "Woah! Choose some different words",
											});
											error = true;
										}

										const pushObj = {
											topic: values.topic,
											name: values.name,
											time: firebase.database.ServerValue.TIMESTAMP,
										};
										console.log(pushObj);

										if (!error) {
											firebase
												.database()
												.ref("openMeetings/meetings")
												.push(pushObj)
												.then(() => {
													notification.success({
														message: "Meeting Created",
														description: values.topic,
													});
												})
												.catch((err) => {
													notification.error({
														message: "Error",
														description: err.message,
													});
												});
										}
									}.bind(this)}
								>
									<Form.Item
										name="topic"
										label="Meeting Topic"
										required
										hasFeedback={this.state.meetingTopicFeedback}
										validateStatus={this.state.meetingTopicValidate}
										help={this.state.meetingTopicHelp}
									>
										<Input
											placeholder="Hack Club meeting!"
											onChange={function (value) {
												if (filter.isProfane(value)) {
													this.setState({
														meetingTopicFeedback: true,
														meetingTopicValidate: "error",
														meetingTopicHelp:
															"Woah! Choose some different words",
													});
												} else {
													this.setState({
														meetingTopicFeedback: false,
														meetingTopicValidate: "success",
														meetingTopicHelp: null,
													});
												}
											}.bind(this)}
										/>
									</Form.Item>
									<Form.Item
										name="name"
										label="Your Name"
										required
										hasFeedback={this.state.nameFeedback}
										validateStatus={this.state.nameValidate}
										help={this.state.nameHelp}
									>
										<Input
											placeholder="Bob"
											onChange={function (value) {
												if (filter.isProfane(value)) {
													this.setState({
														nameFeedback: true,
														nameValidate: "error",
														nameHelp: "Woah! Choose some different words",
													});
												} else {
													this.setState({
														nameFeedback: false,
														nameValidate: "success",
														nameHelp: null,
													});
												}
											}.bind(this)}
										/>
									</Form.Item>
									<Form.Item>
										<Button type="primary" htmlType="submit">
											Create Meeting!
										</Button>
									</Form.Item>
								</Form>
							</div>
						</>
					)}
				</div>
				<div>
					<h1>Recent Open Meetings</h1>
					<List
						dataSource={function () {
							var arr = [];
							for (let meeting of Object.keys(
								this.state.openMeetings.meetings
							).reverse()) {
								arr.push(this.state.openMeetings.meetings[meeting]);
							}
							return arr;
						}.bind(this)()}
						renderItem={(row) => (
							<>
								<p>{row.name}</p>
								<p>{row.time}</p>
								<p>{row.topic}</p>
							</>
						)}
					/>
				</div>
			</>
		);
	}
}

export default OpenMeeting;
