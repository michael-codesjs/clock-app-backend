import { configureEnviromentVariables } from "@utilities/functions";
import type { DeleteItemOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { Model, NullModel } from "../abstracts/model";
import type { AbsoluteUserAttributes } from "../types";
import { UserFactory } from "./user";

configureEnviromentVariables();

type AbsoluteUserVariant = ReturnType<typeof UserFactory.createEntity<AbsoluteUserAttributes>>;

export class UserModel extends Model {

	readonly entity: AbsoluteUserVariant;

	constructor(user: AbsoluteUserVariant) {
		super(user);
	}

	async mutate(): Promise<UpdateItemOutput> {

		const recordUpdateResult = await super.mutate();

		/*

		const cognitoAdminUpdateParams = {
			UserPoolId: COGNITO_USER_POOL_ID!,
			Username: this.entity.id,
			UserAttributes: Object.entries(this.entity.attributes()).map(([key, value]) => {
				return {
					Name: key,
					Value: value as string
				};
			})
		};


		await cognitoProvider()
			.adminUpdateUserAttributes(cognitoAdminUpdateParams) // update user attributes in the cognito user pool
			.promise();

			TODO: move this to a seperate lambda triggered by a dynamoDb stream 

			*/

		return recordUpdateResult;

	}


	async delete(): Promise<DeleteItemOutput> {

		const recordDeleteResult = await super.delete(); // delete record from the database

		/*
		const cognitoDeleteParams = {
			Username: this.entity.id,
			UserPoolId: COGNITO_USER_POOL_ID!
		};

		await cognitoProvider()
			.adminDeleteUser(cognitoDeleteParams) // delete user in the cognito user pool
			.promise();

			TODO: move this to a seperate lambda triggered by a dynamoDb stream 
		*/

		return recordDeleteResult;

	}

}

export class NullUserModel extends NullModel { }