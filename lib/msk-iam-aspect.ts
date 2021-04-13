import * as cdk from '@aws-cdk/core';

export default class PermissionsBoundary implements cdk.IAspect {
  private readonly permissionsBoundaryArn: string;

  constructor(permissionBoundaryArn: string) {
    this.permissionsBoundaryArn = permissionBoundaryArn;
  }

  public visit(construct: cdk.IConstruct): void {
    // See that we're dealing with an IAM Role
    if (cdk.CfnResource.isCfnResource(construct) && construct.cfnResourceType === 'AWS::IAM::Role') {
      construct.addPropertyOverride('PermissionsBoundary', this.permissionsBoundaryArn);
    }
  }
}
