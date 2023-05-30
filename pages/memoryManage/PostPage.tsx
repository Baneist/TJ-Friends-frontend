import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, Pressable, Keyboard, Dimensions, Text, Alert, Switch, Platform } from 'react-native';
import { Button, Divider, IconButton, List } from 'react-native-paper';
import MultiPicker from "../../components/AvatarPicker/MultiPicker";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import requestApi, { BASE_URL } from '../../utils/request';
import { StackNavigationProps } from '../../App';
import Modal from 'react-native-modal';
import uploadImage from '../../utils/uploadImage';

const PostPage = ({ route, navigation }: StackNavigationProps) => {
	//获取屏幕宽高
	const { width, height } = Dimensions.get("screen");
	const [showPickerOption, setShowPickerOption] = useState(false);
	const [text, setText] = useState('');
	const [image, setImage] = useState([] as string[]);
	const [clicked, setClick] = useState(false);
	async function handlePost() {
		// 发送text和image到服务器
		for (let index in image) {
			const imageRes = await uploadImage(image[index]);
			if (imageRes.code === 0) {
				image[index] = BASE_URL + imageRes.data.url;
			}
		}
		const res = await requestApi('post', '/Post', { postContent: text, photoUrl: image, pms: pmskey, isAnonymous: anonymous }, true, 'post失败')
		if (res.code == 0) {
			navigation.goBack();
		}
	}

	function cancelPickerOption() {
		return (
			setShowPickerOption(false)
		);
	}

	function changeImage(uri: string[]) {
		setImage(current => current.concat(uri))
	}
	const [anonymous, setAnonymous] = useState(false);
	const [MenuVisible, setMenuVisible] = useState(false);
	const toggleMenu = () => {
		setMenuVisible(!MenuVisible);
	};
	const [pms, setPms] = useState('公开');
	const [pmskey, setKey] = useState(0);
	const [opct, setopct] = useState([1, 0, 0, 0]);
	function Check(key: number) {
		if (key == 0) {
			setPms('公开');
			setKey(0);
		}
		else if (key == 1) {
			setPms('好友圈');
			setKey(1);
		}
		else if (key == 2) {
			setPms('仅粉丝');
			setKey(2);
		}
		else {
			setPms('仅自己可见');
			setKey(3);
		}
		let tmp = [0, 0, 0, 0];
		tmp[key] = 1;
		setopct(tmp);
		toggleMenu();
	}

	function SelectPms() {
		return (
			<View style={styles.menu}>
				<List.Section >
					<List.Subheader style={{ fontSize: 16 }}>选择权限</List.Subheader>
					<List.Item title={'公开'}
						description="所有人可见"
						left={() => <Icon name='access-point' size={24} style={{ marginLeft: 15 }} />}
						right={() => <Icon name="check" size={20} style={{ opacity: opct[0], marginRight: -10, color: 'purple' }} />}
						onPress={() => Check(0)}
					/>
					<List.Item title={'好友圈'}
						description="相互关注好友可见"
						left={() => <Icon name='cards-heart-outline' size={24} style={{ marginLeft: 15 }} />}
						right={() => <Icon name="check" size={20} style={{ opacity: opct[1], marginRight: -10, color: 'purple' }} />}
						onPress={() => Check(1)}
					/>
					<List.Item title={'仅粉丝'}
						description="关注你的人可见"
						left={() => <Icon name='account-heart-outline' size={24} style={{ marginLeft: 15 }} />}
						right={() => <Icon name="check" size={20} style={{ opacity: opct[2], marginRight: -10, color: 'purple' }} />}
						onPress={() => Check(2)}
					/>
					<List.Item title={'仅自己可见'}
						left={() => <Icon name='lock-outline' size={24} style={{ marginLeft: 15 }} />}
						right={() => <Icon name="check" size={20} style={{ opacity: opct[3], marginRight: -10, color: 'purple' }} />}
						onPress={() => Check(3)}
					/>
				</List.Section>
			</View>

		);
	}

	const hasUnsavedChanges = Boolean(text);
	async function handleSave() {
		// 发送text和image到服务器
		for (let index in image) {
			const imageRes = await uploadImage(image[index]);
			if (imageRes.code === 0) {
				image[index] = BASE_URL + imageRes.data.url;
			}
		}
		const res = await requestApi('post', '/createDraft', { postContent: text, photoUrl: image, pms: pmskey, isAnonymous: anonymous }, true, 'post失败')
		return res;
	}
	React.useEffect(
		() => {
			const onbackpage = navigation.addListener('beforeRemove', (e) => {
				if (!hasUnsavedChanges || clicked) {
					// If we don't have unsaved changes, then we don't need to do anything
					return;
				}

				// Prevent default behavior of leaving the screen
				e.preventDefault();

				// Prompt the user before leaving the screen
				Alert.alert(
					'',
					'将此次编辑保存为草稿?',
					[
						{
							text: "不保存",
							style: 'destructive',
							// This will continue the action that had triggered the removal of the screen
							onPress: () => navigation.dispatch(e.data.action)
						},
						{
							text: '保存',
							style: 'cancel',
							onPress: () => {
								const res = handleSave();
								if (res.code == 0) {
									navigation.dispatch(e.data.action);
								}
							},
						},
					]
				);
			});
			return onbackpage;
		}, [navigation, hasUnsavedChanges, clicked]
	);

	return (
		<View>
			<KeyboardAwareScrollView style={styles.container} onScrollToTop={Keyboard.dismiss}>
				<TextInput
					style={styles.input}
					placeholder="说点什么吧..."
					value={text}
					onChangeText={setText}
					multiline
					scrollEnabled={false}
					autoFocus={false}
				/>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap', position: 'relative', paddingBottom: 10 }}>
					{image.length != 0 && image.map((item) =>
						<View>
							<Image source={{ uri: item }} style={styles.image} />
							<Pressable
								style={{ position: 'absolute', top: 5, right: 5, margin: 0 }}
								onPress={() => setImage(current => current.filter((i) => {
									return i != item
								}))}>
								<Icon name={'window-close'} style={{ fontSize: 15, color: 'white', backgroundColor: 'grey', opacity: 0.6 }} />
							</Pressable>
						</View>
					)}
					{image.length < 9 && <IconButton
						icon={'plus'}
						mode='contained'
						style={{ borderRadius: 0, margin: 5, width: 112, height: 112 }}
						size={50}
						onPress={() => setShowPickerOption(true)}
					/>}
				</View>
				<View style={{
					backgroundColor: '#fff',
					paddingBottom: 20,
					paddingTop: 20,
					flexDirection: 'column',
					width: width,
				}}>
					<Divider />
					<List.Item title='谁可以看'
						left={() => <Icon name='account-outline' size={24} style={{ marginLeft: 15 }} />}
						right={() => <Text style={{ paddingTop: 3, color: 'indigo', paddingRight: 5 }}>{pms}</Text>}
						onPress={toggleMenu}
					/>
					<Divider />
					<List.Item title='匿名'
						left={() => <Icon name='ninja' size={24} style={{ marginLeft: 15 }} />}
						right={() => <Switch
							style={{ marginTop: Platform.OS == 'ios' ? -3 : -10, marginBottom: Platform.OS == 'ios' ? -3 : -10 }}
							value={anonymous}
							onValueChange={() => setAnonymous(!anonymous)}
						/>}
					/>
					<Divider />
				</View>
				<View style={{ paddingBottom: 100 }} >
					<Button disabled={text.length == 0 && image.length == 0} onPress={() => { setClick(true); handlePost(); }} mode='contained'>发送</Button>
				</View>
				<MultiPicker showPickerOption={showPickerOption} onBackdropPress={cancelPickerOption} setImage={changeImage} />

			</KeyboardAwareScrollView>
			<Modal
				isVisible={MenuVisible}
				onBackdropPress={toggleMenu}
				style={styles.modal}
			>
				<View>
					<SelectPms />

				</View>
			</Modal>
		</View>
	);
};

export const styles = StyleSheet.create({
	container: {
		padding: 10,
		marginTop: Platform.OS == 'ios' ? 0 : -60,
		backgroundColor: '#fff',
		paddingBottom: 300,
		borderColor: '#fff'
	},
	input: {
		minHeight: 140,
		borderColor: 'transparent',
		borderWidth: 1,
		padding: 10,
		fontSize: 18,
	},
	image: {
		borderRadius: 0,
		margin: 5,
		width: 112,
		height: 112
	},
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	menu: {
		backgroundColor: '#fff',
		padding: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
});

export default PostPage;
