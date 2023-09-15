import { ValidationChain, validationResult } from "express-validator";
import { Request, Response } from "express";

export default abstract class SerializerPromise<F, T> {

  abstract serializePromise(instance: F): T;

  abstract deserializePromise(data: T): Promise<F>;

  public serializeManyPromise(instances: F[]): Promise<T[]> {
    return Promise.all(instances.map((instance: F) => this.serializePromise(instance)));
  }

  public deserializeManyPromise(dataArray: T[]): Promise<F[]> {
    return Promise.all(dataArray.map((data: T) => this.deserializePromise(data)));
  }

  protected getValidations(): ValidationChain[] {
    return [];
  }

  public async validate(req: Request, res: Response) {

    for (let validation of this.getValidations()) {
      const result = await validation.run(req);
      if (!result.isEmpty())
        break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return;
    }

    res.status(400).json({ errors: errors.array() });

  }

}