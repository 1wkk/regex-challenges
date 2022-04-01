export interface _DeepPartialArray<T> extends Array<DeepPartial<T>> {}

export type _DeepPartialObject<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? _DeepPartialArray<U>
  : T extends object
  ? _DeepPartialObject<T>
  : T | undefined

export type Difficulty = 'Ava' | 'Bella' | 'Carol' | 'Diana' | 'Eileen'

export interface ChMetaInfo {
  title: string
  author: {
    name: string
    email: string
    github: string
  }
  original_issues: number[]
  recommended_solutions: number[]
  tags?: string[]
  related?: string[]
}

export interface Ch {
  no: number
  difficulty: Difficulty
  path: string
  info: Record<string, DeepPartial<ChMetaInfo> | undefined>
  readme: Record<string, string>
  code: any
}
