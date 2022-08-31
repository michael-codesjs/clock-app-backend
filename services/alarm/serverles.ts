import { AWS } from "../../types/aws";
import { commomEnviromentResources, commonCloudFormationImports, commonCustom, commonEnviromentVariables, commonPluginConfig, commonPlugins } from "../../utilities/commons";
import { config } from "../../utilities/constants";
import { createDataSource, createMappingTemplate, generateServiceName } from "../../utilities/functions";


const serverlessConfiguration: AWS.Service = {

  service: generateServiceName("alarm"),

  provider: {
    name: config.provider,
    region: config.region,
    stage: config.stage,
    runtime: config.runtime,
    environment: {
      ...commonEnviromentVariables,
      ...commomEnviromentResources
    }
  },

  plugins: [
    ...commonPlugins,
    "serverless-appsync-plugin",
  ],

  custom: {
    ...commonCustom,
    ...commonPluginConfig,
    ...commonCloudFormationImports,
    appSync: {
      apiId: "${self:custom.apiId}",
      schema: "../../schema.graphql",
      mappingTemplates: [
        createMappingTemplate({
          field: "getAlarm",
          type: "Query",
          source: "getAlarm",
        }),
        createMappingTemplate({
          field: "getAlarms",
          type: "Query",
          source: "getAlarms",
        }),
        createMappingTemplate({
          field: "editAlarm",
          type: "Mutation",
          source: "editAlarm",
        }),
        createMappingTemplate({
          field: "deleteAlarm",
          type: "Query",
          source: "deleteAlarm",
        })
      ],
      dataSources: [
        createDataSource("getAlarm"),
        createDataSource("getAlarms"),
        createDataSource("editAlarm"),
        createDataSource("editAlarm"),
      ]
    },

  }

}

module.exports = serverlessConfiguration;