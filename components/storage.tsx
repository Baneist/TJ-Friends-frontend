import AsyncStorage from "@react-native-async-storage/async-storage"

export default class SyncStorage {
    
	static cache: { [key: string]: string } = {}

	// 初始化需要在App启动时执行
	static async init() {
    	let keys = await AsyncStorage.getAllKeys()
    	let items = await AsyncStorage.multiGet(keys).then()
    	items.map(([key, value]) => {
        	this.cache[key] = value
    	})
	}

	static getValue(key: string) {
    	return this.cache[key]
	}

	static setValue(key: string, value: string) {
    	if (this.cache[key] === value) return
    	this.cache[key] = value
    	AsyncStorage.setItem(key, value)
	}

	static removeKey(key: string) {
    	delete this.cache[key]
    	AsyncStorage.removeItem(key)
	}
}