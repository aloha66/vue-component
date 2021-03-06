export type PullDownRefresh =
  | boolean
  | {
      threshold: number
      stop: number
    }

export type PullUpLoad = boolean | { threshold: number }

interface BaseOption {
  scrollX?: boolean
  scrollY?: boolean
  bounce?: boolean
  target?: any
}

export interface Request {
  // 请求对象
  loading: boolean
  finished: boolean
  list: []
}

export interface ScrollViewProps extends BaseOption {
  request?: Request
  // 下拉动作
  pullDownRefresh?: PullDownRefresh
  pullUpLoad?: PullUpLoad
}

export type PullDownStatus =
  | 'normal'
  | 'loading'
  | 'loosing'
  | 'pulling'
  | 'success'
