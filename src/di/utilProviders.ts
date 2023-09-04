
import { AuthConfig } from "../config/authConfig"
import KeyFactory from "../utils/keyFactory"


export default class UtilsProvider{

	private static keyFactory?: KeyFactory

	public static provideKeyFactory(): KeyFactory{
		if(UtilsProvider.keyFactory === undefined){
			let path = AuthConfig.SECURITY_KEYS_PATH;
			UtilsProvider.keyFactory = new KeyFactory(path!)
		}
		return UtilsProvider.keyFactory!;
		
	}
	
}