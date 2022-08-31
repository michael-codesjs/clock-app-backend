import { esBuildConfig } from "../plugin-configs/esbuild";
import { AWS } from "../types/aws";
import { stacks, config } from "./constants";
import { importLocalCloudFormationParam } from "./functions";

export const commonPlugins = [
  "serverless-esbuild",
  "serverless-export-env",
  "serverless-iam-roles-per-function",
];

export const commonPluginConfig = {
  ...esBuildConfig
}


export const commonCustom = {
  region: "${opt:region, self:provider.region}",
  stage: "${opt:stage, self:provider.stage}"
}

export const commonEnviromentVariables = {
  REGION: "${self:custom.region}",
  STAGE: "${self:custom.stage}",
  AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1"
};

export const commomEnviromentResources = {
  // use together with commonCloudFormationImports
  DYNAMO_DB_TABLE_NAME: "${self:custom.tableName}",
  // ASSETS_BUCKET_NAME: "${self:custom.assetsBucketName}",
  GRAPHQL_API_ID: "${self:custom.apiId}",
  GRAPHQL_API_ENDPOINT: "${self:custom.apiEndpoint}",
}

export const commonCloudFormationImports = {

  tableName: importLocalCloudFormationParam({
    stack: "root",
    output: stacks.root.outputs.table.name,
  }),
  tableArn:  importLocalCloudFormationParam({
    stack: "root",
    output: stacks.root.outputs.table.arn
  }),
  /*
  assetsBucketName: importLocalCloudFormationParam({
    stack: "root",
    output: stacks.root.outputs.assetsBucket.name
  }),
  assetsBucketArn: importLocalCloudFormationParam({
    stack: "root",
    output: stacks.root.outputs.assetsBucket.arn
  }), */
  apiId: importLocalCloudFormationParam({
    stack: "api",
    output: stacks.api.outputs.api.id
  }),
  apiEndpoint: importLocalCloudFormationParam({
    stack: "api",
    output: stacks.api.outputs.api.endpoint
  })

}

export const commonProviderAttributes: AWS.Service["provider"] = {
  name: config.provider,
  region: config.region,
  stage: config.stage,
  runtime: config.runtime,
}