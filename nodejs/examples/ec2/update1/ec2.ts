// Copyright 2016-2018, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import { Config } from "@pulumi/pulumi";

const config = new pulumi.Config("aws");
const providerOpts = { provider: new aws.Provider("prov", { region: <aws.Region>config.require("envRegion") }) };

console.log("EC2: Update1");

const vpc = new awsx.ec2.Vpc("testing-1", {}, providerOpts);
const cluster1 = new awsx.ecs.Cluster("testing-1", { vpc }, providerOpts);
export const clusterId = cluster1.id;

const autoScalingGroup = cluster1.createAutoScalingGroup("testing-1", {
    subnetIds: vpc.publicSubnetIds,
    templateParameters: {
        minSize: 10,
    },
    launchConfigurationArgs: {
        instanceType: "m5.large",
        associatePublicIpAddress: true,
    },
});

export const autoScalingGroupId = autoScalingGroup.stack.id;
