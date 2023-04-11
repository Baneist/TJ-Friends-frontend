import React , {useState}from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Button, Card, Text, Chip,
    Searchbar, Provider,Snackbar,IconButton, List,Divider } from 'react-native-paper';
import {Props} from '../../App'
import Modal from 'react-native-modal';
import {
    View
  } from "react-native"


const EditLabel = ({route, navigation}:Props) =>{
    const [allLabel, setAllLabel] = useState([
        '猫派','狗派','二次元','现充','舟批','原批','Switch玩家','体育生','篮球'
    ])
    const [userLabel, setUserLabel] = useState([
        '金闪闪','帅','金发','红瞳','AUO','愉悦教主','强','黄金三靶'
    ])
    //记录加了哪些，直接setUserLabel会重新渲染从而对话框消失
    let addItem = [] as string [];
    //const [addItem, setAddItem] = useState([] as string [])
    function submit(){
        console.log('submit');
        navigation.goBack()
    }
    function delLabel(idx:number){
        //删除回显
        setUserLabel((userLabel) => userLabel.filter(item => userLabel.indexOf(item)!== idx))
    }
    function addLabel(label:string){
        //添加回显
        addItem.push(label);
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
                    {allLabel.map((label, idx)=>
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