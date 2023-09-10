  
export class AuthConfig{

	public static ACCESS_TOKEN_EXPIRES_IN: number = 2592000; // 30 days in seconds
	public static REFRESH_TOKEN_EXPIRES_IN: number = 60;
	public static SECURITY_KEYS_PATH: string = ".keys";
	public static ORIGIN =  ['http://localhost:8080', 'http://localhost:3000'];

}