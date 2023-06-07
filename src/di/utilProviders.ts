
import KeyFactory from "../utils/keyFactory"
import config from "config"


export default class UtilsProvider{

	private static keyFactory?: KeyFactory

	public static provideKeyFactory(): KeyFactory{
		if(UtilsProvider.keyFactory === undefined){
			let path = process.env[config.get<string>('securityKeysPath')]
			UtilsProvider.keyFactory = new KeyFactory(path!)
		}
		return UtilsProvider.keyFactory!;
		
	}
	
}