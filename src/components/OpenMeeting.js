import React from "react";
import firebase from "./../firebase";
import config from "./../config";
import {
	Button,
	Form,
	Input,
	notification,
	List,
	Tooltip,
	Popconfirm,
} from "antd";
import Filter from "bad-words";
import moment from "moment";
import axios from "axios";
import "./OpenMeeting.css";
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
			onGoingPushKey: null,
			openZoomJoin: false,
			openZoomScheme: "#",
			openZoomURL: "#",
			mobile: /iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(
				navigator.userAgent.toLowerCase()
			),
			submitLoading: false,
			forceNewMeeting: false,
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
		//
		if (Object.keys(this.state.openMeetings.meetings).length !== 0) {
			const lastMeetingPushKey = Object.keys(this.state.openMeetings.meetings)[
				Object.keys(this.state.openMeetings.meetings).length - 1
			];
			const openZoomURL = this.state.openMeetings.meetings[lastMeetingPushKey]
				.url;
			const openZoomScheme =
				(this.state.mobile ? "zoomus" : "zoommtg") +
				"://" +
				config.zoomDomain +
				"/join?confno=" +
				openZoomURL.split("/").pop();

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
			const gracePeriod = moment(new Date()).subtract(2, "hours");
			if (lastUsed.isBetween(gracePeriod, now)) {
				this.setState({
					onGoing: true,
					onGoingMeeting: {
						...this.state.openMeetings.meetings[lastMeetingPushKey],
						lastJoined:
							typeof this.state.openMeetings.meetings[lastMeetingPushKey]
								.joins === "undefined"
								? null
								: lastMeetingJoinTime,
					},
					onGoingPushKey: lastMeetingPushKey,
					openZoomURL: openZoomURL,
					openZoomScheme: openZoomScheme,
				});
			} else {
				this.setState({
					onGoing: false,
					onGoingMeeting: null,
					openZoomURL: "#",
					openZoomScheme: "#",
				});
			}
		}
	}

	async logCurrentJoin() {
		firebase
			.database()
			.ref("openMeetings/meetings/" + this.state.onGoingPushKey + "/joins")
			.push(firebase.database.ServerValue.TIMESTAMP);
	}

	render() {
		return (
			<>
				<div>
					<div>
						{this.state.forceNewMeeting || !this.state.onGoing ? (
							<>
								<div className="openMeetings-top">
									<h1>Start an Open Meeting</h1>
									<div className="openMeetings-start-formWrapper">
										<Form
											hideRequiredMark
											onFinish={function (values) {
												this.setState({ submitLoading: true });
												console.log(values);

												var error = false;

												if (
													values.name === "" ||
													typeof values.name === "undefined"
												) {
													notification.error({
														message: "Please enter your name",
													});
													error = true;
												}

												if (
													values.topic === "" ||
													typeof values.topic === "undefined"
												) {
													notification.error({
														message: "Please enter a meeting topic",
													});
													error = true;
												}

												if (
													values.key === "" ||
													typeof values.key === "undefined"
												) {
													notification.error({
														message: "Please enter your access key",
													});
													error = true;
												}

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
														meetingTopicHelp:
															"Woah! Choose some different words",
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

												if (!error) {
													axios
														.post(
															new URL("/v1/zoom/openMeetings", config.apiPath),
															{
																topic: values.topic,
																name: values.name,
																key: values.key,
															}
														)
														.then(
															(response) => {
																console.log(response);

																notification.success({
																	message: "Meeting Created",
																	description: values.topic,
																});
																this.setState({
																	submitLoading: false,
																	forceNewMeeting: false,
																});
															},
															(err) => {
																console.log(err);
																notification.error({
																	message: "Error",
																	description: err.response.data,
																});
																this.setState({
																	submitLoading: false,
																});
															}
														);
												} else {
													this.setState({
														submitLoading: false,
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
											<Form.Item name="key" label="Access Key" required>
												<Input placeholder="password1234" />
											</Form.Item>
											<Form.Item>
												<Button
													type="primary"
													htmlType="submit"
													loading={this.state.submitLoading}
												>
													Create Meeting!
												</Button>
											</Form.Item>
										</Form>
									</div>
								</div>
							</>
						) : (
							<>
								{this.state.onGoingMeeting !== null ? (
									<>
										<div className="openMeetings-top openMeetings-onGoing">
											<h1>{this.state.onGoingMeeting.topic}</h1>

											<Button
												type="primary"
												href={
													!this.state.openZoomJoin
														? this.state.openZoomScheme
														: this.state.openZoomURL
												}
												onClick={function () {
													if (!this.state.openZoomJoin) {
														this.logCurrentJoin();
														setInterval(
															function () {
																this.setState({ openZoomJoin: true });
															}.bind(this),
															100
														);
													}
												}.bind(this)}
												size="large"
												className="openMeetings-onGoing-button"
											>
												Join Zoom
											</Button>
											<p>
												Started{" "}
												{moment(this.state.onGoingMeeting.time, "x").fromNow()}{" "}
												by {this.state.onGoingMeeting.name}
												<br />
												{this.state.onGoingMeeting.lastJoined !== null ? (
													<>
														Last joined{" "}
														{moment(
															this.state.onGoingMeeting.lastJoined,
															"x"
														).fromNow()}
													</>
												) : (
													<span style={{ fontStyle: "italic" }}>
														It's one lonely meeting... no one has joined yet
													</span>
												)}
											</p>
											<div className="openMeetings-onGoing-startMeeting">
												<Popconfirm
													title={
														<>
															<h3>
																Are you sure you want to start a new meeting?!
															</h3>
															<span>
																If the current meeting is still ongoing it will
																<br />
																kick them out. I suggest you join the
																<br />
																ongoing meeting to see if anyone's using it!
															</span>
														</>
													}
													onConfirm={() => {
														this.setState({ forceNewMeeting: true });
													}}
												>
													<a>Start New Meeting</a>
												</Popconfirm>
											</div>
										</div>
									</>
								) : (
									<></>
								)}
							</>
						)}
					</div>
					<div className="openMeeting-bottom">
						<div>
							<h1>Recent Meetings</h1>
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
									<List.Item key={row.url}>
										<p>
											<strong>{row.topic}</strong> started by{" "}
											<span style={{ fontStyle: "italic" }}>{row.name}</span>
										</p>
										<Tooltip
											title={moment(row.time, "x").format(
												"MMM D[,] YYYY hh:mm:ssa"
											)}
										>
											<p>{moment(row.time, "x").fromNow()} </p>
										</Tooltip>
									</List.Item>
								)}
								pagination={{ defaultPageSize: 3 }}
							/>
						</div>
						<div>
							<h1>What are Open Meetings?</h1>
							<p>blah blah</p>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default OpenMeeting;
