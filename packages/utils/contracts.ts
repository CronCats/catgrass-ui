export enum CwCoreVersion {
  V0_0_0 = '0.0.0',
}

export const parseCoreVersion = (version: string): CwCoreVersion | undefined =>
  version === CwCoreVersion.V0_0_0 ? CwCoreVersion.V0_0_0 : undefined
