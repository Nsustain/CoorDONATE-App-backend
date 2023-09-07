import { ValidationChain, validationResult } from "express-validator";
import { Request, Response } from "express";


export default abstract class Serializer<F, T>{

	abstract serialize(instance: F): T

	abstract deserialize(data: T): F

	abstract deserializePromise(data: T): Promise<F>;


	public serializeMany(instances: F[]): T[]{
		return instances.map(
			(instance: F) => {
				return this.serialize(instance);
			}
		)
	}


	public deserializeManyPromise(dataArray: T[]): Promise<F[]> {
		return Promise.all(dataArray.map((data: T) => this.deserializePromise(data)));
	  }
	  
	public deserializeMany(dataArray: T[]): F[]{
		return dataArray.map(
			(data: T) => {
				return this.deserialize(data);
			}
		)
	}

	protected getValidations(): ValidationChain[]{
		return [];
	}

	public async validate(req: Request, res: Response){
		
		for(let validation of this.getValidations()){
			const result = await validation.run(req);
			if (!result.isEmpty()) 
				break;
		}

		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return;
		}

		res.status(400).json({errors: errors.array()});

	}


}