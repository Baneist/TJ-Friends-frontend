import React , {useState,useEffect}from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Button, Card, Text, Chip,
    Searchbar, Provider,Snackbar,IconButton, List,Divider } from 'react-native-paper';
import {NavigationProps} from '../../../App'
import Modal from 'react-native-modal';
import {
    View
  } from "react-native"
import request from "../../../utils/request";
import { defaultInfo } from "../Profile";
import requestApi from "../../../utils/request";
import handleAxiosError from "../../../utils/handleError";

//所有标签
const allLabel = [
    '猫派','狗派','二次元','现充','舟批','原批','Switch玩家','体育生','篮球',
]

const EditLabel = ({route, navigation}:NavigationProps) =>{
    const [userLabel, setUserLabel] = useState([] as string [])
    let userInfo = defaultInfo;
    const userID='2052909';
    //初始化
    async function fetchData(){
        try{
            const res = await requestApi('get', `/profile/${userID}`, null,null, true);
            if(res.data.code==0){
                userInfo = res.data.data;
                setUserLabel(userInfo.userLabel.info);
            }
            else{
              console.log('code err',res.data.code)
            }
          } catch(err){
            handleAxiosError(err);
        }
    }
    useEffect(()=>{
        fetchData()
    },[])
    async function submit(){
        userInfo.userLabel.info=userLabel;
        console.log(userLabel)
        try{
            const res = await requestApi('put', '/updateUserInfo',null, userInfo, true);
            if(res.status==200){
              navigation.goBack()
            }
            else{
              console.log('err',res.status)
            }
          } catch(err){
            handleAxiosError(err);
        }
    }
    //记录加了哪些，直接setUserLabel会重新渲染从而对话框消失
    let addItem = [] as string [];
    function delLabel(idx:number){
        //删除回显
        setUserLabel((userLabel) => userLabel.filter(item => userLabel.indexOf(item)!== idx))
    }
    function addAllChosen(){
        console.log(addItem)
        setUserLabel(current => current.concat(addItem))
        //清空
        addItem = []
        setShowDialog(false);
    }
    //添加新标签
    const [showDialog, setShowDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const NewLabelDialog = () => {
        const [allItem, setallItem] = useState(allLabel.filter(item => userLabel.indexOf(item) ==-1))
        function addLabel(label:string){
            //添加回显
            console.log(allItem)
            setallItem(allItem.filter((item)=>item!=label));
            addItem.push(label);
        }
        return(
            <View>
            <Modal
            isVisible={showDialog}
            >
              <Card>
                <Card.Title 
                title='添加标签'
                subtitle='Add New Label'
                titleVariant='titleMedium'
                left={(props) => <IconButton {...props} size={25} icon="label-multiple" />}
                />
                <Card.Content>
                  <Searchbar
                    placeholder="Search"
                    mode='bar'
                    value={searchQuery}
                    style={{marginBottom:15}}
                  />
                  <View style={{flexDirection:"row",flexWrap:'wrap'}}>
                    {allItem.map((label, idx)=>
                    <Chip key={idx} style={{marginRight:10,marginBottom:10}} 
                    mode='outlined' 
                    closeIcon={() =>(
                        <IconButton icon='plus' iconColor="darkblue" 
                        style={{marginRight:-10}} 
                        onPress={()=>{addLabel(label)}}/>
                    )}
                    onClose={() =>{setShowDialog(true)}}
                    >
                        <Text>{label}</Text>
                    </Chip>
                )}
                </View>
                </Card.Content>
                <Card.Actions>
                  {<Button mode='outlined' style={{marginRight:10}} 
                  onPress={addAllChosen}>
                    确定</Button>}
                  <Button mode='outlined' onPress={() =>{setShowDialog(false)
                  }}>取消</Button>
                </Card.Actions>
              </Card>
            </Modal>
          </View>
        )
    }
    return(
        <Card mode='outlined' style={{borderRadius:0}}>
            <Card.Title title="标签" subtitle="Your Label" />
            <Card.Content>
            <View style={{flexDirection:"row",flexWrap:'wrap'}}>
                {userLabel.map((label, idx)=>
                <Chip key={idx} style={{marginRight:10,marginBottom:10}} 
                mode='outlined' 
                closeIcon={() =>(
                    <IconButton icon='close' iconColor="darkred" style={{marginRight:-10}} onPress={()=>delLabel(idx)}/>
                )}
                onClose={()=>delLabel(idx)}
                >
                    <Text>{label}</Text>
                </Chip>
            )}
            </View>
            <View>
                <Button icon='plus' onPress={()=>{setShowDialog(true)}}>添加新标签...</Button>
                <NewLabelDialog />
            </View>
            </Card.Content>
            <Card.Actions>
            <Button onPress={()=>{navigation.goBack()}}>取消</Button>
            <Button onPress={submit}>保存</Button>
            </Card.Actions>
        </Card>
    )
}
export default EditLabel;