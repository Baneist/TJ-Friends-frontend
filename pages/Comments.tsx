import React, {useState, useEffect} from 'react';
import {Pressable, ScrollView, View, Image, Text, KeyboardAvoidingView, Platform, Dimensions} from 'react-native';
import {Card, TextInput, Button, Divider, IconButton} from 'react-native-paper';
import {styles, Share} from './Memories'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import Modal from 'react-native-modal';
import {StackNavigationProps} from '../App';
import requestApi from '../utils/request';

interface CardProps {
  clickAvatar: () => void,
  content: any,
  id: any
}

function UserPhoto(props: CardProps) {
  return (
    <Pressable onPress={props.clickAvatar}>
      <Image source={{uri: props.content.userAvatar}} style={styles.userphoto}/>
    </Pressable>
  );
}

function Like(props: CardProps) {
  const [likeNum, setLike] = useState(props.content.likeNum);
  const [isLiked, setIsLiked] = useState(props.content.isLiked);
  useEffect(() => {
    setLike(props.content.likeNum);
    setIsLiked(props.content.isLiked);
  }, [props.content.likeNum, props.content.isLiked]);

  function handleClick() {
    async function fetchData() {
      const res = await requestApi('get', `/updateLikeMemory/${props.id}`, null, true, 'like失败');
      if (res.code === 0) {
        setLike(res.data.likeNum);
        setIsLiked(res.data.isLiked);
      }
    }

    fetchData()
  }

  const clickHeart =
    <Icon size={18} name={isLiked ? 'heart' : 'heart-outline'}/>;
  return (
    <Button onPress={handleClick} style={{flexDirection: 'row'}}>
      {clickHeart}
      {likeNum != '0' && <Text style={{fontSize: 17, fontWeight: '400'}}> {likeNum}</Text>}
    </Button>
  );
}

function Thumb(props: CardProps) {
  const [likeNum, setLike] = useState(props.content.likeNum);
  const [isLiked, setIsLiked] = useState(props.content.isLiked);
  useEffect(() => {
    setLike(props.content.likeNum);
    setIsLiked(props.content.isLiked);
  }, [props.content.likeNum, props.content.isLiked]);

  function handleClick() {
    async function fetchData() {
      const res = await requestApi('get', `/updateLikeComment/${props.content.commentId}`, null, true, 'thumb失败');
      if (res.code == 0) {
        setLike(res.data.likeNum);
        setIsLiked(res.data.isLiked);
      }

    }

    fetchData()
    //console.log(props.content.likeNum);
  }

  const thumb =
    <View style={{flexDirection: 'row'}}>
      <Icon size={17} name={isLiked ? 'thumb-up' : 'thumb-up-outline'}/>
      {likeNum != '0' && <Text style={{paddingLeft: 5}}>{likeNum}</Text>}
    </View>;

  return (
    <Pressable
      style={{marginRight: 20}}
      onPress={handleClick}
      hitSlop={2}
    >
      {thumb}
    </Pressable>
  );
}

function CommentCard(props: CardProps) {

  return (
    <Card mode='outlined' style={styles.commentcard}>
      <Card.Title
        title={props.content.userName}
        subtitle={
          <Text
            style={{
              color: 'grey',
              fontSize: 12.5
            }}>
            {props.content.postTime}
          </Text>}
        left={() => <UserPhoto
          clickAvatar={props.clickAvatar}
          content={props.content}
          id={props.id}
        />}
        right={() => <Thumb
          clickAvatar={props.clickAvatar}
          content={props.content}
          id={props.id}/>}
      />
      <Card.Content style={{marginLeft: 55}}>
        <Text>
          {props.content.commentContent}
        </Text>
      </Card.Content>
    </Card>
  );
}

function DetailedCard(props: CardProps) {
  const [MenuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!MenuVisible);
  };
  const list = props.content.postPhoto;
  //获取屏幕宽高
  const {width} = Dimensions.get("screen");

  return (
    <View>
      <Card mode='outlined' style={styles.commentcard}>
        <Card.Title
          title={props.content.userName}
          subtitle={props.content.postTime}
          left={() => <UserPhoto
            clickAvatar={props.clickAvatar}
            content={props.content}
            id={props.id}/>}
          right={() => <IconButton icon='dots-horizontal' onPress={toggleMenu}/>}
        />
        <Card.Content>
          <Text>
            {props.content.postContent}
          </Text>
        </Card.Content>
        {list.map((item: string) =>
          <Image
            source={{uri: item}}
            style={{
              borderWidth: 15,
              borderColor: '#fff',
              backgroundColor: '#fff',
              width: width,
              height: width,
              marginBottom: -15
            }}
          />
        )}
        <View style={{justifyContent: 'space-evenly', flexDirection: 'row', paddingBottom: 10, paddingTop: 10}}>
          <Like clickAvatar={() => {
          }} content={props.content} id={props.id}/>
          <Share onCommentPress={() => {
          }} clickAvatar={() => {
          }} content={props.content}/>
        </View>
      </Card>
      <Modal
        isVisible={MenuVisible}
        onBackdropPress={toggleMenu}
        style={styles.modal}
      >
        <View style={styles.menu}>
          <Button style={{height: 50}} onPress={() => {
          }}>收藏</Button>
          <Divider/>
          <Button style={{height: 50, paddingTop: 5}} onPress={() => {
          }}>举报</Button>
          <Divider/>
          <Button style={{height: 50, paddingTop: 10}} onPress={() => {
          }}>删除</Button>
        </View>
      </Modal>
    </View>
  );
}

const defaulthh = {
  likeNum: "29",
  repoNum: "23",
  userName: "锺刚",
  postTime: "1985-08-31 10:44:54",
  userAvatar: "http://dummyimage.com/100x100",
  postPhoto: [
    "http://dummyimage.com/400x400",
    "http://dummyimage.com/400x400",
    "http://dummyimage.com/400x400",
    "http://dummyimage.com/400x400"
  ],
  postContent: "qui est tempor Excepteur",
  comments: [
    {
      isLiked: false,
      userAvatar: "http://dummyimage.com/100x100",
      likeNum: "99",
      commentContent: "pariatur",
      postTime: "1989-02-15 04:57:35",
      userName: "梁娟"
    }
  ],
  senderAvatar: "http://dummyimage.com/100x100",
  isLiked: false
}
const dc = [
  {
    isLiked: false,
    userAvatar: "http://dummyimage.com/100x100",
    likeNum: "99",
    commentContent: "pariatur",
    postTime: "1989-02-15 04:57:35",
    userName: "梁娟"
  },
  {
    isLiked: false,
    userAvatar: "http://dummyimage.com/100x100",
    likeNum: "99",
    commentContent: "pariatur",
    postTime: "1989-02-15 04:57:35",
    userName: "梁娟"
  },
  {
    isLiked: false,
    userAvatar: "http://dummyimage.com/100x100",
    likeNum: "99",
    commentContent: "pariatur",
    postTime: "1989-02-15 04:57:35",
    userName: "梁娟"
  }
]

function Comment({route, navigation}: StackNavigationProps) {
  const [text, setText] = React.useState("");
  const id = route.params?.postId;

  function clickAvatar() {
    navigation.navigate('OthersPage');
  }

  const [detail, setDetail] = useState(defaulthh);
  const [commentlist, setList] = useState(dc);

  async function fetchData() {
    const res = await requestApi('get', `/Memories/${id}`, null, true, 'get memories失败');
    if (res.code == 0) {
      setDetail(res.data);
      setList(res.data.comments);
    }
    console.log(res.data)
    console.log("fetch")
  }

  useEffect(() => {
    fetchData()
    console.log('ue')
  }, [])

  async function postComment() {
    const res=await requestApi('post', `/postComment`, {postId: id, content: text}, true, 'post comment失败');
    if(res.code==0){
    setText('');
    console.log(id,text,'pressed');
    fetchData();
    console.log(res.data);
    console.log(detail);
  }
  }

  return (
    <View>
      <Modal
        isVisible={true}
        style={styles.modal}
        coverScreen={false}
        hasBackdrop={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={80}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            height: 80,
            backgroundColor: '#fff',
            alignItems: 'center',
            paddingBottom: 15
          }}>
            <Image source={{uri: detail.senderAvatar}} style={styles.userphoto}/>
            <TextInput
              label={<Text style={{color: 'lightgrey'}}>Add a comment</Text>}
              value={text}
              onChangeText={text => setText(text)}
              mode='outlined'
              outlineStyle={{backgroundColor: '#fff', borderColor: 'lightgrey', borderRadius: 21}}
              style={{width: 245, height: 42}}
            />
            <Button style={{marginLeft: -15, borderWidth: 5}} onPress={postComment}>Send</Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <ScrollView>
        <DetailedCard
          clickAvatar={clickAvatar}
          content={detail}
          id={id}
        />
        <View style={{margin: 5}}/>
        {commentlist.map((item) =>
          <CommentCard
            clickAvatar={clickAvatar}
            content={item}
            id={id}
          />)}
        <View style={{margin: 20}}/>
        <Text
          style={{
            fontSize: 13,
            color: 'gainsboro',
            textAlign: 'center',
            marginTop: 5,
            marginBottom: 12
          }}>
          Reach the bottom
        </Text>
      </ScrollView>
    </View>
  );
}

export default Comment;