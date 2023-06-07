import path from "path";
import fs from "fs";

export enum KeyFunction{
	access,
	refresh
}


export enum KeyName{
	private,
	public
}

export default class KeyFactory{



	private containerPath: string

	constructor(containerPath: string){
		this.containerPath = containerPath;
	}

	private generateKeyPath(fun: KeyFunction, name: KeyName): string{
		return `${KeyFunction[fun]}.${KeyName[name]}.key`
	}

	public getKey(fun: KeyFunction, name: KeyName): string{
		return Buffer.from(fs.readFileSync(path.join(this.containerPath, this.generateKeyPath(fun, name)))).toString()
	}


}